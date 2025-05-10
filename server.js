const express = require('express');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const multer = require('multer');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// folder publiczny do serwowania plików graficznych
app.use('/avatars', express.static(path.join(__dirname, 'public/avatars')));

const USERS_FILE = path.join(__dirname, 'users.json');

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/avatars');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    cb(null, filename);
  }
});
const upload = multer({ storage });

// Funkcje użytkowników
function readUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  const data = fs.readFileSync(USERS_FILE, 'utf8');
  return JSON.parse(data);
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Rejestracja
app.post('/register', async (req, res) => {
  const { name, surname, phone, email, password } = req.body;
  if (!name || !surname || !phone || !email || !password) {
    return res.status(400).json({ error: 'Wszystkie pola są wymagane.' });
  }

  const users = readUsers();
  const userExists = users.find(u => u.email === email);
  if (userExists) {
    return res.status(409).json({ error: 'Taki użytkownik już istnieje.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ name, surname, phone, email, password: hashedPassword, avatar: null });
  writeUsers(users);

  res.status(201).json({ message: 'Użytkownik zapisany.' });
});

// Logowanie
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const users = readUsers();
  const user = users.find(u => u.email === email);

  if (!user) return res.status(404).json({ error: 'Użytkownik nie istnieje.' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Nieprawidłowe hasło.' });

  res.json({
    message: 'Zalogowano pomyślnie.',
    name: user.name,
    surname: user.surname,
    phone: user.phone,
    email: user.email,
    avatar: user.avatar
  });
});

// Zmiana hasła
app.post('/change-password', async (req, res) => {
  const { email, newPassword } = req.body;
  const users = readUsers();
  const user = users.find(u => u.email === email);
  if (!user) return res.status(404).json({ error: 'Użytkownik nie istnieje.' });

  user.password = await bcrypt.hash(newPassword, 10);
  writeUsers(users);
  res.json({ message: 'Hasło zmienione.' });
});

// Upload avatara
app.post('/avatar-upload', upload.single('avatar'), (req, res) => {
  const { email } = req.body;
  if (!req.file || !email) return res.status(400).json({ error: 'Brakuje pliku lub e-maila.' });

  const users = readUsers();
  const user = users.find(u => u.email === email);
  if (!user) return res.status(404).json({ error: 'Użytkownik nie istnieje.' });

  user.avatar = req.file.filename;
  writeUsers(users);

  res.json({ message: 'Avatar zapisany.', file: req.file.filename });
});

app.listen(PORT, () => {
  console.log(`✅ Serwer działa na http://localhost:${PORT}`);
});

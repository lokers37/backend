const express = require('express');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

const USERS_FILE = path.join(__dirname, 'users.json');

// folder na avatary
const AVATAR_FOLDER = path.join(__dirname, 'public', 'avatars');
fs.mkdirSync(AVATAR_FOLDER, { recursive: true });
app.use('/avatars', express.static(AVATAR_FOLDER));

// Upload avatarów
const storage = multer.diskStorage({
  destination: AVATAR_FOLDER,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e5);
    cb(null, `${unique}${ext}`);
  }
});
const upload = multer({ storage });

// Wczytaj użytkowników
function readUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  const data = fs.readFileSync(USERS_FILE, 'utf8');
  return JSON.parse(data);
}

// Zapisz użytkowników
function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Rejestracja
app.post('/register', async (req, res) => {
  const { name, surname, email, phone, password } = req.body;
  if (!name || !surname || !email || !phone || !password) {
    return res.status(400).json({ error: 'Wszystkie pola są wymagane.' });
  }

  const users = readUsers();
  if (users.find(u => u.email === email)) {
    return res.status(409).json({ error: 'Użytkownik już istnieje.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ name, surname, email, phone, password: hashedPassword });
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
    email: user.email,
    phone: user.phone,
    avatar: user.avatar || null
  });
});

// Zmiana hasła
app.post('/change-password', async (req, res) => {
  const { email, newPassword } = req.body;
  const users = readUsers();
  const user = users.find(u => u.email === email);
  if (!user) return res.status(404).json({ error: 'Nie znaleziono użytkownika.' });

  user.password = await bcrypt.hash(newPassword, 10);
  writeUsers(users);
  res.json({ message: 'Hasło zmienione.' });
});

// Przesyłanie avatara
app.post('/avatar-upload', upload.single('avatar'), (req, res) => {
  const email = req.body.email;
  const users = readUsers();
  const user = users.find(u => u.email === email);
  if (!user) return res.status(404).json({ error: 'Użytkownik nie istnieje.' });

  user.avatar = req.file.filename;
  writeUsers(users);
  res.json({ message: 'Avatar zapisany.', file: req.file.filename });
});

// Pobierz wszystkich użytkowników (dla panelu admina)
app.get('/users', (req, res) => {
  const users = readUsers();
  res.json(users.map(u => ({
    name: u.name,
    surname: u.surname,
    email: u.email,
    phone: u.phone,
    avatar: u.avatar || null
  })));
});

// Usuń użytkownika
app.delete('/users/:email', (req, res) => {
  const email = req.params.email;
  let users = readUsers();
  const found = users.some(u => u.email === email);
  if (!found) return res.status(404).json({ error: 'Nie znaleziono użytkownika.' });

  users = users.filter(u => u.email !== email);
  writeUsers(users);
  res.json({ message: 'Użytkownik usunięty.' });
});

// Start serwera
app.listen(PORT, () => {
  console.log(`✅ Serwer działa na http://localhost:${PORT}`);
});

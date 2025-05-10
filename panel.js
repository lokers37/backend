document.addEventListener("DOMContentLoaded", () => {
  const nameDisplay = document.getElementById("userName");
  const emailDisplay = document.getElementById("userEmail");
  const phoneDisplay = document.getElementById("userPhone");
  const avatarPreview = document.getElementById("avatarPreview");
  const avatarInput = document.getElementById("avatarInput");
  const logoutButton = document.getElementById("logoutButton");
  const saveChangesButton = document.getElementById("saveChanges");
  const newPassword = document.getElementById("newPassword");
  const confirmPassword = document.getElementById("confirmPassword");
  const themeToggle = document.getElementById("toggleTheme");
  const tabs = document.querySelectorAll(".tab");
  const sections = document.querySelectorAll(".section");

  const name = localStorage.getItem("userName");
  const surname = localStorage.getItem("userSurname");
  const email = localStorage.getItem("userEmail");
  const phone = localStorage.getItem("userPhone") || "";
  const avatar = localStorage.getItem("userAvatar");

  if (!email || !name || !surname) {
    window.location.href = "index.html";
    return;
  }

  nameDisplay.textContent = `${name} ${surname}`;
  emailDisplay.textContent = email;
  if (phoneDisplay) phoneDisplay.textContent = phone;
  avatarPreview.src = avatar
    ? `https://moj-backend-9e7n.onrender.com/avatars/${avatar}`
    : "https://via.placeholder.com/80?text=👤";

  // Obsługa awatara
  avatarInput.addEventListener("change", async function () {
    const file = this.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    const formData = new FormData();
    formData.append("avatar", file);
    formData.append("email", email);

    const response = await https://moj-backend-9e7n.onrender.com/avatar-upload", {
      method: "POST",
      body: formData
    });

    const result = await response.json();
    if (response.ok && result.file) {
      localStorage.setItem("userAvatar", result.file);
      avatarPreview.src = `https://moj-backend-9e7n.onrender.com/avatars/${result.file}`;
    } else {
      alert("Błąd zapisu avatara.");
    }
  });

  // Obsługa przycisku Zapisz zmiany
  saveChangesButton.addEventListener("click", async () => {
    const newPass = newPassword.value.trim();
    const confirmPass = confirmPassword.value.trim();

    if (!newPass || !confirmPass) {
      alert("Uzupełnij oba pola hasła.");
      return;
    }

    if (newPass !== confirmPass) {
      alert("Hasła się nie zgadzają.");
      return;
    }

    const response = await https://moj-backend-9e7n.onrender.com/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword: newPass })
    });

    const result = await response.json();
    if (response.ok) {
      alert("Hasło zostało zmienione.");
      newPassword.value = "";
      confirmPassword.value = "";
    } else {
      alert("Błąd: " + result.error);
    }
  });

  // Wylogowanie
  logoutButton.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "index.html";
  });

  // Przełączanie zakładek
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      sections.forEach((s) => s.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(tab.dataset.tab).classList.add("active");
    });
  });

  // Przełącz motyw
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });
});

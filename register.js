document.addEventListener("DOMContentLoaded", () => {
  const name = document.getElementById("name");
  const surname = document.getElementById("surname");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const password = document.getElementById("password");
  const button = document.getElementById("registerButton");
  const message = document.getElementById("registerMessage");

  button.addEventListener("click", async () => {
    const data = {
      name: name.value.trim(),
      surname: surname.value.trim(),
      email: email.value.trim(),
      phone: phone.value.trim(),
      password: password.value.trim()
    };

    // Walidacja
    if (!data.name || !data.surname || !data.email || !data.phone || !data.password) {
      message.textContent = "Uzupełnij wszystkie pola.";
      message.style.color = "red";
      return;
    }

    try {
      const res = await fetch("https://moj-backend-9e7n.onrender.com/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (res.ok) {
        message.textContent = "Rejestracja zakończona sukcesem!";
        message.style.color = "green";
        setTimeout(() => {
          window.location.href = "index.html";
        }, 2000);
      } else {
        message.textContent = result.error || "Błąd rejestracji.";
        message.style.color = "red";
      }
    } catch (err) {
      message.textContent = "Błąd połączenia z serwerem.";
      message.style.color = "red";
      console.error(err);
    }
  });
});

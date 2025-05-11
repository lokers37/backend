document.addEventListener("DOMContentLoaded", () => {
  const name = document.getElementById("name");
  const surname = document.getElementById("surname");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const password = document.getElementById("password");
  const message = document.getElementById("message");
  const button = document.getElementById("registerButton");

  button.addEventListener("click", async () => {
    const user = {
      name: name.value.trim(),
      surname: surname.value.trim(),
      email: email.value.trim(),
      phone: phone.value.trim(),
      password: password.value.trim()
    };

    // Walidacja
    if (!user.name || !user.surname || !user.email || !user.phone || !user.password) {
      alert("Uzupełnij wszystkie pola.");
      return;
    }

    try {
      const response = await fetch("https://moj-backend-9e7n.onrender.com/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
      });

      const result = await response.json();

      if (response.ok) {
        message.textContent = "Użytkownik zapisany. Możesz się teraz zalogować.";
        message.style.color = "green";
        setTimeout(() => {
          window.location.href = "index.html";
        }, 2000);
      } else {
        message.textContent = result.error || "Wystąpił błąd.";
        message.style.color = "red";
      }
    } catch (err) {
      console.error(err);
      message.textContent = "Błąd połączenia z serwerem.";
      message.style.color = "red";
    }
  });
});

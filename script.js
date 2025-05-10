document.addEventListener("DOMContentLoaded", () => {
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const loginButton = document.getElementById("loginButton");
    const forgotPasswordButton = document.getElementById("forgotPasswordButton");
  
    function validateEmail(email) {
      const re = /\S+@\S+\.\S+/;
      return re.test(email);
    }
  
    loginButton?.addEventListener("click", async function () {
      const enteredEmail = email.value.trim();
      const enteredPassword = password.value.trim();
  
      if (!enteredEmail || !enteredPassword) {
        alert("Wszystkie pola muszą być wypełnione!");
        return;
      }
  
      if (!validateEmail(enteredEmail)) {
        alert("Nieprawidłowy e-mail.");
        return;
      }
  
      try {
        const response = await https://moj-backend-9e7n.onrender.com/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: enteredEmail,
            password: enteredPassword
          })
        });
  
        const result = await response.json();
  
        if (response.ok) {
          // Zapisz pełne dane użytkownika
          localStorage.setItem("loggedIn", "true");
          localStorage.setItem("userEmail", result.email);
          localStorage.setItem("userName", result.name);
          localStorage.setItem("userSurname", result.surname);
          localStorage.setItem("userPhone", result.phone || "");
          if (result.avatar) {
            localStorage.setItem("userAvatar", result.avatar);
          }
  
          window.location.href = "panel.html";
        } else {
          alert("Błąd logowania: " + (result.error || "Nieznany błąd"));
        }
      } catch (error) {
        alert("Błąd połączenia z serwerem.");
        console.error(error);
      }
    });
  
    forgotPasswordButton?.addEventListener("click", function () {
      window.open("change-password.html", "_blank");
    });
  });

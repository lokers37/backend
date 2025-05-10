document.addEventListener("DOMContentLoaded", function () {
    const verifyEmailInput = document.getElementById("verifyEmail");
    const verifyEmailButton = document.getElementById("verifyEmailButton");
    const emailError = document.getElementById("emailError");

    const emailStep = document.getElementById("emailStep");
    const passwordStep = document.getElementById("passwordStep");

    const currentPassword = document.getElementById("currentPassword");
    const newPassword = document.getElementById("newPassword");
    const confirmPassword = document.getElementById("confirmPassword");
    const changePasswordButton = document.getElementById("changePasswordButton");
    const changeMessage = document.getElementById("changeMessage");

    // ⚠️ Domyślny testowy e-mail i hasło
    if (!localStorage.getItem("userEmail")) {
        localStorage.setItem("userEmail", "admin@example.com");
        localStorage.setItem("userPassword", "1234");
    }

    // Walidacja e-maila
    function validateEmail(email) {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    verifyEmailButton.addEventListener("click", function () {
        const email = verifyEmailInput.value.trim();
        const storedEmail = localStorage.getItem("userEmail");

        if (!validateEmail(email)) {
            emailError.textContent = "Nieprawidłowy adres e-mail.";
            return;
        }

        if (email !== storedEmail) {
            emailError.textContent = "Ten e-mail nie istnieje w systemie.";
            return;
        }

        emailError.textContent = "";
        emailStep.style.display = "none";
        passwordStep.style.display = "block";
    });

    changePasswordButton.addEventListener("click", function () {
        const storedPassword = localStorage.getItem("userPassword");

        if (currentPassword.value !== storedPassword) {
            changeMessage.textContent = "Nieprawidłowe aktualne hasło.";
            changeMessage.style.color = "red";
            return;
        }

        if (newPassword.value !== confirmPassword.value) {
            changeMessage.textContent = "Nowe hasła nie są zgodne.";
            changeMessage.style.color = "red";
            return;
        }

        localStorage.setItem("userPassword", newPassword.value);
        changeMessage.textContent = "Hasło zostało zmienione!";
        changeMessage.style.color = "green";
    });
});
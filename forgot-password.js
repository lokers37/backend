document.addEventListener("DOMContentLoaded", function () {
    const resetEmail = document.getElementById("resetEmail");
    const resetButton = document.getElementById("resetPasswordButton");
    const resetMessage = document.getElementById("resetMessage");

    // Domyślny użytkownik
    if (!localStorage.getItem("userEmail")) {
        localStorage.setItem("userEmail", "admin@example.com");
        localStorage.setItem("userPassword", "1234");
    }

    function validateEmail(email) {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    resetButton.addEventListener("click", function () {
        const enteredEmail = resetEmail.value.trim();
        const storedEmail = localStorage.getItem("userEmail");

        if (!validateEmail(enteredEmail)) {
            resetMessage.textContent = "Nieprawidłowy adres e-mail.";
            resetMessage.style.color = "red";
            return;
        }

        if (enteredEmail !== storedEmail) {
            resetMessage.textContent = "E-mail nie został znaleziony.";
            resetMessage.style.color = "red";
            return;
        }

        // Generujemy tymczasowe hasło (demo)
        const tempPassword = Math.random().toString(36).slice(-8);
        localStorage.setItem("userPassword", tempPassword);

        resetMessage.innerHTML = `Nowe tymczasowe hasło to: <strong>${tempPassword}</strong><br>Użyj go do zalogowania się, a następnie zmień hasło.`;
        resetMessage.style.color = "green";
    });
});
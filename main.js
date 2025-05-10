document.getElementById("loginButton").addEventListener("click", function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const users = JSON.parse(localStorage.getItem("users")) || {};

    if (users[email] && users[email].password === password) {
        localStorage.setItem("loggedInUser", JSON.stringify({ email: email }));
        window.location.href = "panel.html";
    } else {
        alert("Nieprawidłowy email lub hasło.");
    }
});
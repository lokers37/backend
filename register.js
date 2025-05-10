document.getElementById("registerForm").addEventListener("submit", async function (e) {
    e.preventDefault();
  
    const name = document.getElementById("name").value.trim();
    const surname = document.getElementById("surname").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
  
    try {
      const res = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, surname, phone, email, password })
      });
  
      const result = await res.json();
      if (res.ok) {
        alert("Rejestracja zakończona sukcesem!");
        window.location.href = "index.html";
      } else {
        alert("Błąd: " + result.error);
      }
    } catch (err) {
      alert("Błąd połączenia z serwerem.");
      console.error(err);
    }
  });
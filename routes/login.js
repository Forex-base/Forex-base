document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const alertBox = document.getElementById("errorAlert");

  if (!email || !password) {
    alertBox.classList.remove("d-none");
    alertBox.textContent = "Please enter both email and password.";
    return;
  }

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      // Store token and user info in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect to overview/dashboard page
      window.location.href = "overview.html";
    } else {
      alertBox.classList.remove("d-none");
      alertBox.textContent = data.message || "Invalid login credentials.";
    }
  } catch (err) {
    alertBox.classList.remove("d-none");
    alertBox.textContent = "Server error. Please try again later.";
    console.error("Login error:", err);
  }
});

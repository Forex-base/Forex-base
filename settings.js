document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    alert("Please log in first");
    window.location.href = "login.html";
    return;
  }

  const userNameEl = document.getElementById("userName");
  const userEmailEl = document.getElementById("userEmail");
  const userBalanceEl = document.getElementById("userBalance");
  const userBonusEl = document.getElementById("userBonus");

  // Load user data from backend using email
  async function loadUserData() {
    try {
      const res = await fetch(`/api/user/profile?email=${user.email}`);
      if (!res.ok) throw new Error("Failed to fetch profile data");

      const data = await res.json();

      userNameEl.textContent = data.fullName;
      userEmailEl.textContent = data.email;
      userBalanceEl.textContent = data.balance.toFixed(2);
      userBonusEl.textContent = data.bonus.toFixed(2);

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(data));
    } catch (err) {
      console.error("Error loading user data:", err);
    }
  }

  loadUserData();

  const updateForm = document.getElementById("updateForm");

  updateForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value;
    const password = document.getElementById("password").value;

    const updatePayload = {
      email: user.email,
      fullName,
      password
    };

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatePayload)
      });

      const data = await res.json();

      if (res.ok) {
        alert("Profile updated successfully!");
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.reload();
      } else {
        alert(data.error || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("An error occurred while updating your profile.");
    }
  });
});

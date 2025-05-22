// forex-base/admin.js
window.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('/api/user/all');
    const users = await res.json();

    const tbody = document.querySelector('#userTable tbody');
    tbody.innerHTML = '';

    users.forEach(user => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${user.fullName}</td><td>${user.email}</td>`;
      tbody.appendChild(tr);
    });
  } catch (err) {
    alert('Failed to load users');
    console.error('Admin fetch error:', err);
  }
});

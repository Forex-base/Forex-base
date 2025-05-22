// public/js/admin.js

document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/users/all') // ensure server.js maps this correctly
    .then(res => res.json())
    .then(users => {
      const tableBody = document.querySelector('#users-table tbody');
      tableBody.innerHTML = ''; // Clear any existing rows

      users.forEach(user => {
        const row = `
          <tr>
            <td>${user.fullName || 'N/A'}</td>
            <td>${user.email}</td>
            <td>${user.nextofkin}</td>
            <td>${user.phonenumber}      </td>
            <td>${user._id}</td>
            <td>${user.password || 'N/A'}</td> <!-- Hashed password -->
            <td>${user.balance || 0}</td>
            <td>${user.bonus || 0}</td>
          </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', row);
      });
    })
    .catch(err => {
      console.error('Error fetching users:', err);
    });
});
async function updateBalance(userId) {
  const balanceInput = document.getElementById(`balance-${userId}`);
  const newBalance = balanceInput.value;

  try {
    const res = await fetch(`http://localhost:5000/api/users/${userId}/balance`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ balance: parseFloat(newBalance) })
    });

    const data = await res.json();
    if (res.ok) {
      alert('Balance updated successfully');
    } else {
      alert('Error: ' + data.message);
    }
  } catch (err) {
    console.error(err);
    alert('Failed to update balance');
  }
}

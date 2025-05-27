const userToken = localStorage.getItem('token'); // optional if using auth
const userEmail = localStorage.getItem('userEmail'); // or however you're identifying the user

fetch('/api/transactions?email=' + encodeURIComponent(userEmail))
  .then(res => res.json())
  .then(data => {
    const list = document.getElementById('transaction-list');
    list.innerHTML = '';

    data.forEach(tx => {
      const li = document.createElement('li');
      li.textContent = `${tx.type.toUpperCase()} | $${tx.amount} | ${new Date(tx.timestamp).toLocaleString()} | ${tx.status} | ${tx.details}`;
      list.appendChild(li);
    });
  })
  .catch(err => console.error('Error loading transactions:', err));

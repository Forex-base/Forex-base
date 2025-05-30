document.getElementById('registerForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  const data = {
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    username: formData.get('username'),
    password: formData.get('password'),
    phone: formData.get('phone'),
    subscribe: formData.get('subscribe') === 'on'
  };

  if (formData.get('password') !== formData.get('confirm-password')) {
    alert('Passwords do not match');
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok) {
      alert('Registration successful!');
      window.location.href = '/admin.html';
    } else {
      alert(`Registration failed: ${result.message}`);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Server error during registration.');
  }
});

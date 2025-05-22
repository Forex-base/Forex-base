app.get('/settings', (req, res) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  res.sendFile(__dirname + '/public/settings.html');
});

Or if you're using JWT:

const jwt = require('jsonwebtoken');

app.get('/settings', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, 'your_secret_key', (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    res.sendFile(__dirname + '/public/settings.html');
  });
});

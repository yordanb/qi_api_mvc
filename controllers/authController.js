const jwt = require('jsonwebtoken');
require('dotenv').config();

// Dummy user untuk contoh
const users = [
    {
        id: 1,
        username: 'user1',
        password: 'password1',
        role: 'staff'
    },
    {
        id: 2,
        username: 'user2',
        password: 'password2',
        role: 'mekanik'
    }
];

const login = (req, res) => {
    const { username, password } = req.body;

    // Cari user berdasarkan username dan password
    const user = users.find(
        u => u.username === username && u.password === password
    );

    if (!user) {
        return res.status(401).json({ message: 'Username atau password salah' });
    }

    // Buat payload untuk token
    const payload = {
        id: user.id,
        username: user.username,
        role: user.role
    };

    // Generate token
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
};

module.exports = { login };
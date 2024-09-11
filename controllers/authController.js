const jwt = require('jsonwebtoken');
require('dotenv').config();
const data = require('../models/userModel');

// Dummy user untuk contoh
/*
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
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1m' });

    res.json({ token });
};

module.exports = { login };
*/


//versi data dari mysql2

const login = async (req, res) => {
    const { NRP, password } = req.body;
    //console.log(req.body);

    try {
        // Query untuk mencari user berdasarkan username dan password
        /*
        const [rows] = await db.query(
            'SELECT id, username, role FROM tb_users WHERE username = ? AND password = ?',
            [username, password]
        );
        */

        const [rows] = await data.getRoleByNRP(NRP, password); 
        // Jika user tidak ditemukan
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Username atau password salah' });
        }

        const user = rows;

        // Buat payload untuk token
        const payload = {
            id: user.id,
            username: user.Nama,
            //role: user.Role,
            devID: user.DeviceID
        }; console.log(payload);

        // Generate token
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });

        res.json({ token });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { login };
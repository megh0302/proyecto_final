const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
    async create(nombre, email, contraseña) {
        const hashedPassword = await bcrypt.hash(contraseña, 10);
        const [result] = await pool.query(
            'INSERT INTO usuarios (nombre, email, contraseña) VALUES (?, ?, ?)',
            [nombre, email, hashedPassword]
        );
        return result.insertId;
    },

    async findByEmail(email) {
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        return rows[0];
    }
};

module.exports = User;
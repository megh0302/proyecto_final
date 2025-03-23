const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const login = async (req, res) => {
    const { email, contraseña } = req.body;
    const user = await User.findByEmail(email);

    if (!user || !(await bcrypt.compare(contraseña, user.contraseña))) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ id: user.id_usuario, tipo: user.tipo_usuario }, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });
    res.status(200).json({ token });
};

const register = async (req, res) => {
    const { nombre, email, contraseña } = req.body;
    try {
        const id = await User.create(nombre, email, contraseña);
        res.status(201).json({ message: 'Usuario creado', id });
    } catch (error) {
        res.status(400).json({ message: 'Error al crear usuario', error });
    }
};

module.exports = { login, register };
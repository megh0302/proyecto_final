const pool = require('../config/db');

exports.disableUser = async (req, res) => {
    const { id } = req.params;
    try {
        const [users] = await pool.query('SELECT * FROM Users WHERE id = ?', [id]);
        if (users.length === 0) return res.status(404).json({ message: 'User not found' });
        if (users[0].role === 'admin') return res.status(400).json({ message: 'Cannot disable admin' });

        await pool.query('UPDATE Users SET is_active = FALSE WHERE id = ?', [id]);
        res.status(200).json({ message: 'User disabled' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
const pool = require('../config/db');

exports.createRoom = async (req, res) => {
    const { name, movie_title, movie_poster, seat_rows, seat_columns } = req.body;
    try {
        await pool.query('INSERT INTO Rooms (name, movie_title, movie_poster, seat_rows, seat_columns) VALUES (?, ?, ?, ?, ?)',
            [name, movie_title, movie_poster, seat_rows, seat_columns]);
        res.status(201).json({ message: 'Room created' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateRoom = async (req, res) => {
    const { id } = req.params;
    const { movie_title, movie_poster } = req.body;
    try {
        const [reservations] = await pool.query('SELECT * FROM Reservations WHERE room_id = ?', [id]);
        if (reservations.length > 0) return res.status(400).json({ message: 'Cannot update room with reservations' });

        await pool.query('UPDATE Rooms SET movie_title = ?, movie_poster = ? WHERE id = ?', [movie_title, movie_poster, id]);
        res.status(200).json({ message: 'Room updated' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateCapacity = async (req, res) => {
    const { id } = req.params;
    const { seat_rows, seat_columns } = req.body;
    try {
        const [reservations] = await pool.query('SELECT * FROM Reservations WHERE room_id = ?', [id]);
        if (reservations.length > 0) return res.status(400).json({ message: 'Cannot update capacity with reservations' });

        await pool.query('UPDATE Rooms SET seat_rows = ?, seat_columns = ? WHERE id = ?', [seat_rows, seat_columns, id]);
        res.status(200).json({ message: 'Capacity updated' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getRooms = async (req, res) => {
    try {
        const [rooms] = await pool.query('SELECT * FROM Rooms');
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
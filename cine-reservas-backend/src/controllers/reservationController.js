const pool = require('../config/db');

exports.createReservation = async (req, res) => {
    const { room_id, seats, date } = req.body;
    const user_id = req.user.id;
    try {
        const [room] = await pool.query('SELECT seat_rows, seat_columns FROM Rooms WHERE id = ?', [room_id]);
        if (room.length === 0) return res.status(404).json({ message: 'Room not found' });

        const { seat_rows, seat_columns } = room[0];
        for (const { row, column } of seats) {
            if (row < 1 || row > seat_rows || column < 1 || column > seat_columns) {
                return res.status(400).json({ message: 'Invalid seat' });
            }
            const [existing] = await pool.query('SELECT * FROM Reservations WHERE room_id = ? AND seat_row = ? AND seat_column = ? AND date = ?',
                [room_id, row, column, date]);
            if (existing.length > 0) return res.status(400).json({ message: `Seat ${row}-${column} already reserved` });
        }

        for (const { row, column } of seats) {
            await pool.query('INSERT INTO Reservations (user_id, room_id, seat_row, seat_column, date) VALUES (?, ?, ?, ?, ?)',
                [user_id, room_id, row, column, date]);
        }
        res.status(201).json({ message: 'Reservation created' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getReservations = async (req, res) => {
    const { roomId, date } = req.params;
    try {
        const [reservations] = await pool.query('SELECT seat_row, seat_column FROM Reservations WHERE room_id = ? AND date = ?', [roomId, date]);
        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
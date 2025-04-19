const pool = require('../config/db');

exports.createRoom = async (req, res) => {
    const { name, movie_title, movie_poster, seat_rows, seat_columns } = req.body;
    try {
        if (!name || !movie_title || !movie_poster || !Number.isInteger(Number(seat_rows)) || !Number.isInteger(Number(seat_columns))) {
            return res.status(400).json({ message: 'Todos los campos son requeridos y las filas/columnas deben ser enteros' });
        }
        if (seat_rows <= 0 || seat_columns <= 0) {
            return res.status(400).json({ message: 'Las filas y columnas deben ser positivas' });
        }
        await pool.query('INSERT INTO Rooms (name, movie_title, movie_poster, seat_rows, seat_columns) VALUES (?, ?, ?, ?, ?)',
            [name, movie_title, movie_poster, seat_rows, seat_columns]);
        res.status(201).json({ message: 'Sala creada' });
    } catch (error) {
        console.error('Error en createRoom:', error);
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
};

exports.updateRoom = async (req, res) => {
    const { id } = req.params;
    const { movie_title, movie_poster } = req.body;
    try {
        if (!movie_title || !movie_poster) {
            return res.status(400).json({ message: 'El título de la película y el póster son requeridos' });
        }
        const [reservations] = await pool.query('SELECT * FROM Reservations WHERE room_id = ?', [id]);
        if (reservations.length > 0) return res.status(400).json({ message: 'No se puede actualizar una sala con reservas' });

        const [result] = await pool.query('UPDATE Rooms SET movie_title = ?, movie_poster = ? WHERE id = ?', [movie_title, movie_poster, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Sala no encontrada' });
        }
        res.status(200).json({ message: 'Sala actualizada' });
    } catch (error) {
        console.error(`Error en updateRoom (id: ${id}):`, error);
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
};

exports.updateCapacity = async (req, res) => {
    const { id } = req.params;
    const { seat_rows, seat_columns } = req.body;
    try {
        if (!Number.isInteger(Number(seat_rows)) || !Number.isInteger(Number(seat_columns))) {
            return res.status(400).json({ message: 'Las filas y columnas deben ser enteros' });
        }
        if (seat_rows <= 0 || seat_columns <= 0) {
            return res.status(400).json({ message: 'Las filas y columnas deben ser positivas' });
        }
        const [room] = await pool.query('SELECT * FROM Rooms WHERE id = ?', [id]);
        if (room.length === 0) {
            return res.status(404).json({ message: 'Sala no encontrada' });
        }
        const [reservations] = await pool.query('SELECT seat_row, seat_column FROM Reservations WHERE room_id = ?', [id]);
        for (const reservation of reservations) {
            if (reservation.seat_row > seat_rows || reservation.seat_column > seat_columns) {
                return res.status(400).json({
                    message: `No se puede reducir la capacidad: hay una reserva en la fila ${reservation.seat_row}, columna ${reservation.seat_column}`,
                });
            }
        }
        const [result] = await pool.query('UPDATE Rooms SET seat_rows = ?, seat_columns = ? WHERE id = ?', [seat_rows, seat_columns, id]);
        res.status(200).json({ message: 'Capacidad actualizada' });
    } catch (error) {
        console.error(`Error en updateCapacity (id: ${id}):`, error);
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
};

exports.getRooms = async (req, res) => {
    try {
        const [rooms] = await pool.query('SELECT * FROM Rooms');
        res.status(200).json(rooms);
    } catch (error) {
        console.error('Error en getRooms:', error);
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
};

exports.deleteRoom = async (req, res) => {
    const { id } = req.params;
    const { force } = req.query; // Parámetro para forzar eliminación
    try {
        const [room] = await pool.query('SELECT * FROM Rooms WHERE id = ?', [id]);
        if (room.length === 0) {
            return res.status(404).json({ message: 'Sala no encontrada' });
        }

        const [reservations] = await pool.query('SELECT * FROM Reservations WHERE room_id = ?', [id]);
        if (reservations.length > 0 && force !== 'true') {
            return res.status(400).json({ message: 'No se puede eliminar una sala con reservas activas' });
        }

        // Si force=true, eliminar reservas primero
        if (force === 'true') {
            await pool.query('DELETE FROM Reservations WHERE room_id = ?', [id]);
        }

        // Eliminar la sala
        const [result] = await pool.query('DELETE FROM Rooms WHERE id = ?', [id]);
        res.status(200).json({ message: 'Sala eliminada correctamente' });
    } catch (error) {
        console.error(`Error en deleteRoom (id: ${id}):`, error);
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
};
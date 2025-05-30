const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');        // Verifica token
const adminOnly = require('../middleware/admin');  // Verifica que sea admin

// Endpoint: GET /api/admin/report
router.get('/report', auth, adminOnly, async (req, res) => {
    try {
        // 1️⃣ Reservas por sala en los próximos 8 días
        const [reservations] = await pool.query(`
            SELECT room_id, COUNT(*) AS seats_reserved
            FROM reservations
            WHERE date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 8 DAY)
            GROUP BY room_id
        `);

        // 2️⃣ Todas las salas con asientos y precios
        const [rooms] = await pool.query(`
            SELECT id, seat_rows, seat_columns, price
            FROM rooms
        `);

        // Acumuladores
        let totalSeatsReserved = 0;
        let totalIncome = 0;
        let totalLostIncome = 0;

        rooms.forEach(room => {
            const reservedRow = reservations.find(r => r.room_id === room.id);
            const reserved = reservedRow ? reservedRow.seats_reserved : 0;

            const totalSeats = room.seat_rows * room.seat_columns;
            const available = totalSeats - reserved;
            const price = room.price;

            totalSeatsReserved += reserved;
            totalIncome += reserved * price;
            totalLostIncome += available * price;
        });

        res.json({
            seats_reserved: totalSeatsReserved,      // ✅ N1
            total_income: totalIncome,               // ✅ N2
            lost_income: totalLostIncome             // ✅ N3
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al generar el reporte' });
    }
});

module.exports = router;

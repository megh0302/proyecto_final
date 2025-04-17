const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const auth = require('../middleware/auth');

router.post('/', auth, reservationController.createReservation);
router.get('/:roomId/:date', auth, reservationController.getReservations);

module.exports = router;
const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.post('/', [auth, admin], roomController.createRoom);
router.put('/:id', [auth, admin], roomController.updateRoom);
router.put('/:id/capacity', [auth, admin], roomController.updateCapacity);
router.get('/', roomController.getRooms);

module.exports = router;



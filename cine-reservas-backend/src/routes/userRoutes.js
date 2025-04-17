const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.put('/:id/disable', [auth, admin], userController.disableUser);

module.exports = router;
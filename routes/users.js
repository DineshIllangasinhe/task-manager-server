const express = require('express');
const router = express.Router();
const usersCtrl = require('../controllers/usersController');
const { authenticateJWT } = require('../middleware/authMiddleware');

router.get('/users', authenticateJWT, usersCtrl.getUsers);

module.exports = router;

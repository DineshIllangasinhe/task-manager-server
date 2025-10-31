const express = require('express');
const router = express.Router();
const usersCtrl = require('../controllers/usersController');
const { authenticateJWT } = require('../middleware/authMiddleware');

router.get('/users', authenticateJWT, usersCtrl.getUsers);
router.get('/me', authenticateJWT, usersCtrl.getCurrentUser);
router.put('/me', authenticateJWT, usersCtrl.updateCurrentUserValidators, usersCtrl.updateCurrentUser);

module.exports = router;

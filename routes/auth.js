const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authController');
const { authenticateJWT } = require('../middleware/authMiddleware');

router.post('/register', authCtrl.registerValidators, authCtrl.register);
router.post('/login', authCtrl.loginValidators, authCtrl.login);
router.post('/logout', authenticateJWT, authCtrl.logout);

module.exports = router;

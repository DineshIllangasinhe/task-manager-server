const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authController');

router.post('/register', authCtrl.registerValidators, authCtrl.register);

module.exports = router;

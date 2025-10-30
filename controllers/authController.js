const { User } = require('../models');
const bcrypt = require('bcrypt');
require('dotenv').config();
const { body, validationResult } = require('express-validator');

const registerValidators = [
  body('name').trim().notEmpty().withMessage('Name required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password at least 6 chars')
];

const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const { name, email, password } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });
    res.status(200).json({ message:'User created successfully', user: user.toJSON() });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  registerValidators,
  register
};

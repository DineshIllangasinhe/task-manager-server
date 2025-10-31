const { User } = require('../models');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.json({ users });
  } catch (err) {
    next(err);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    res.json({ user: req.user.toJSON() });
  } catch (err) {
    next(err);
  }
};

const updateCurrentUserValidators = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email required'),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const updateCurrentUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const { name, email, password } = req.body;
    const user = req.user;

    if (name !== undefined) {
      user.name = name;
    }
    if (email !== undefined && email !== user.email) {
      const existing = await User.findOne({ where: { email } });
      if (existing) {
        return res.status(409).json({ error: 'Email already in use' });
      }
      user.email = email;
    }
    if (password !== undefined) {
      user.passwordHash = await bcrypt.hash(password, 10);
    }
    await user.save();
    res.json({ message: 'User updated successfully', user: user.toJSON() });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUsers,
  getCurrentUser,
  updateCurrentUser,
  updateCurrentUserValidators,
};

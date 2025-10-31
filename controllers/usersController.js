const { User } = require('../models');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.json({ users });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUsers,
};

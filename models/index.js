// models/index.js
const sequelize = require('../config/db');
const User = require('./user');

const models = {
  User: User.initModel(sequelize),
};

models.sequelize = sequelize;
models.Sequelize = require('sequelize');

module.exports = models;

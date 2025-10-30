const sequelize = require('../config/db');

const models = {
};

models.sequelize = sequelize;
models.Sequelize = require('sequelize');

module.exports = models;

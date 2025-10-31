const sequelize = require('../config/db');
const User = require('./user');
const Task = require('./task');

const models = {
  User: User.initModel(sequelize),
  Task: Task.initModel(sequelize)
};

models.User.hasMany(models.Task, { foreignKey: 'assignedToId', as: 'tasks' });
models.Task.belongsTo(models.User, { foreignKey: 'assignedToId', as: 'assignee' });

models.sequelize = sequelize;
models.Sequelize = require('sequelize');

module.exports = models;

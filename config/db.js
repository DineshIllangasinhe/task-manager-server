const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL || 'sqlite:./task_managment_db.sqlite', {
  logging: false,
  dialectOptions: {
    useUTC: true,
  },
});

module.exports = sequelize;

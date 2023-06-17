
const Sequelize = require('sequelize');
const sequelize = require('../database');

const usergroups = sequelize.define('usergroups', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  groupName: {
    type: Sequelize.STRING
  },
  userName: {
    type: Sequelize.STRING
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
    allowNull: true
  }
  });

module.exports = usergroups;
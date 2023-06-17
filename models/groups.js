const Sequelize = require('sequelize');
const sequelize = require('../database');

const Groups = sequelize.define('groups', {

  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  groupName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Groups;
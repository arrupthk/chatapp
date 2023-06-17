const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Chat = sequelize.define('chats', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false
  },
  urlfile: {
    type: DataTypes.STRING,
  },
});

module.exports = Chat;
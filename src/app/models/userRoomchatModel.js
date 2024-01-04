const { DataTypes } = require('sequelize');

const UserRoomchat = (sequelize) => {
  return sequelize.define('userRoomchat', {
    idUserRoom: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    joinAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    leaveAt: {
      type: DataTypes.DATE,
    },
    deleteBy: {
      type: DataTypes.INTEGER,
    },
  });
};
module.exports = UserRoomchat;

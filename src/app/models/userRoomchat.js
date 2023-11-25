const { DataTypes } = require("sequelize");

const UserRoomchat = (sequelize) => {
  return sequelize.define("userRoomchat", {
    idUserRoom: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  });
};
module.exports = UserRoomchat;

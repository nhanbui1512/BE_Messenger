const { DataTypes } = require('sequelize');

const RoomChat = (sequelize) => {
  return sequelize.define('roomchats', {
    roomId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    roomName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    numberUser: {
      type: DataTypes.INTEGER,
      defaultValue: 2,
    },
    idHostUser: {
      type: DataTypes.INTEGER,
    },

    createAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    createAtStr: {
      type: DataTypes.VIRTUAL,
      get() {
        const time = this.getDataValue('createAt');
        return time;
      },
    },
  });
};

module.exports = RoomChat;

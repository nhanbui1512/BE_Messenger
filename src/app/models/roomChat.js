const { DataTypes } = require("sequelize");

const RoomChat = (sequelize) => {
  return sequelize.define("roomchats", {
    roomId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    numberUser: {
      type: DataTypes.STRING,
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
        const time = this.getDataValue("createAt");
        if (time != null) return timeFormat(time);
        else {
          return time;
        }
      },
    },
  });
};

module.exports = RoomChat;

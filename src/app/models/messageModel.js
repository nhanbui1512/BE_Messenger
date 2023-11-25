const { DataTypes } = require("sequelize");

const Message = (sequelize) => {
  return sequelize.define("messages", {
    messageId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.STRING,
    },
    createAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deleteAt: {
      type: DataTypes.DATE,
    },
  });
};

module.exports = Message;

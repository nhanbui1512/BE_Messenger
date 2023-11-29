const { DataTypes } = require('sequelize');

function MessageGroup(sequelize) {
  return sequelize.define('messagegroups', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    createAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
}
module.exports = MessageGroup;

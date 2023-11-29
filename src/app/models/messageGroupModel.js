const { DataTypes } = require('sequelize');
const { formatTime } = require('../until/time');

function MessageGroup(sequelize) {
  return sequelize.define('messagegroups', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    createAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    createAtStr: {
      type: DataTypes.VIRTUAL,
      get() {
        const time = this.getDataValue('createAt');
        const formatedTime = formatTime(time);
        return `${formatedTime.hour}:${formatedTime.minute} ${formatedTime.day}/${formatedTime.month}/${formatedTime.year}`;
      },
    },
  });
}
module.exports = MessageGroup;

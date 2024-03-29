const { DataTypes } = require('sequelize');
const { formatTime } = require('../until/time');

function Image(sequelize) {
  return sequelize.define('images', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fileUrl: {
      type: DataTypes.STRING,
      get() {
        var fileUrl = this.getDataValue('fileUrl');
        if (fileUrl === null) return fileUrl;
        fileUrl = `${process.env.DOMAIN}/uploads/images/${fileUrl}`;
        return fileUrl;
      },
    },
    createAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deleteAt: {
      type: DataTypes.DATE,
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
module.exports = Image;

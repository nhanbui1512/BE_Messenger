const { DataTypes } = require('sequelize');
const { formatTime } = require('../until/time');

const Message = (sequelize) => {
  return sequelize.define('messages', {
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

    createTimeStr: {
      type: DataTypes.VIRTUAL,
      get() {
        const time = this.getDataValue('createAt');
        const formatedTime = formatTime(time);
        return `${formatedTime.hour}:${formatedTime.minute} ${formatedTime.day}/${formatedTime.month}/${formatedTime.year}`;
      },
    },
    last: {
      type: DataTypes.VIRTUAL,
      get() {
        const currentTime = new Date();
        const createTime = this.getDataValue('createAt');

        const sapces = currentTime - createTime; // khoảng cách tính theo milliseconds

        const lastDays = Math.floor(sapces / (60 * 60 * 24 * 1000)); // khoảng cách ngày

        if (lastDays === 0) {
          const lastHour = Math.floor(sapces / (60 * 60 * 1000)); // khoảng cách giờ
          if (lastHour === 0) {
            const lastMinutes = Math.floor(sapces / (60 * 1000)); // khoảng cách phút
            if (lastMinutes === 0) return 'Vừa xong';
            return `${lastMinutes} phút`;
          }
          return `${lastHour} giờ`;
        }

        if (lastDays >= 7) {
          const week = Math.floor(lastDays / 7); // nếu ngày lớn hơn 7 thì quy về số tuần
          return `${week} tuần`;
        }
        return `${lastDays} ngày`;
      },
    },
  });
};

module.exports = Message;

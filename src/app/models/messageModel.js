const { DataTypes, DATE } = require('sequelize');
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
        return `${formatedTime.hour}:${formatedTime.minute}:${formatedTime.second} ${formatedTime.day}/${formatedTime.month}/${formatedTime.year}`;
      },
    },
    last: {
      type: DataTypes.VIRTUAL,
      get() {
        const currentTime = formatTime(new Date());
        const createTime = formatTime(this.getDataValue('createAt'));

        const lastDays = currentTime.day - createTime.day;
        if (lastDays === 0) {
          const lastHour = currentTime.hour - createTime.hour;
          if (lastHour === 0) {
            const lastMinutes = Number(currentTime.minute) - Number(createTime.minute);
            if (lastMinutes === 0) return 'vừa xong';
            return `${lastMinutes} phút`;
          }
          return `${lastHour} giờ`;
        }

        if (lastDays >= 7) {
          const days = (new Date() - this.getDataValue('createAt')) / (1000 * 3600 * 24);
          const week = Math.floor(days / 7);
          return `${week} tuần`;
        }
        return `${lastDays} ngày`;
      },
    },
  });
};

module.exports = Message;

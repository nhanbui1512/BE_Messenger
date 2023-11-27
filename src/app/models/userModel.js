const { DataTypes } = require('sequelize');

const User = (sequelize) => {
  return sequelize.define('users', {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userName: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      validate: {
        isNumeric: true,
      },
    },
    password: {
      type: DataTypes.STRING,
    },
    avatar: {
      type: DataTypes.STRING,
      get() {
        const avatar = this.getDataValue('avatar');
        return avatar;
      },
    },
    createAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updateAt: {
      type: DataTypes.DATE,
    },
    createAtStr: {
      type: DataTypes.VIRTUAL,
      get() {
        const time = this.getDataValue('createAt');
        return time;
      },
    },
    updateAtStr: {
      type: DataTypes.VIRTUAL,
      get() {
        const time = this.getDataValue('updateAt');
        return time;
      },
    },
  });
};

module.exports = User;

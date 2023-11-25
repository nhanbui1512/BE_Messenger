const User = (sequelize, DataTypes) => {
  return sequelize.define("users", {
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
        const avatar = this.getDataValue("avatar");
        return `/uploads/images/${avatar}`;
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
        const time = this.getDataValue("createAt");
        if (time != null) return timeFormat(time);
        else {
          return time;
        }
      },
    },
    updateAtStr: {
      type: DataTypes.VIRTUAL,
      get() {
        const time = this.getDataValue("updateAt");
        if (time != null) return timeFormat(time);
        else {
          return time;
        }
      },
    },
  });
};

module.exports = User;

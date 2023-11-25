const { Sequelize, DataTypes, Op, fn } = require("sequelize");
const User = require("./user");

const sequelize = new Sequelize("messenger", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
  define: {
    freezeTableName: true,
    timestamps: false,
  },
});

User(sequelize, DataTypes);

module.exports = sequelize;

const { DataTypes } = require('sequelize');

function Reaction(sequelize) {
  return sequelize.define('reactions', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    createAt: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
    },
    deleteAt: {
      type: DataTypes.DATE,
    },
  });
}

module.exports = Reaction;

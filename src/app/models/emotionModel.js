const { DataTypes } = require('sequelize');

function Emotion(sequelize) {
  return sequelize.define('emotions', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createAt: {
      type: DataTypes.DATE,
    },
    updateAt: {
      type: DataTypes.DATE,
    },
    deleteAt: {
      type: DataTypes.DATE,
    },
  });
}

module.exports = Emotion;

const express = require('express');
const { sequelize } = require('./app/models');
const app = express();
const path = require('path');
const route = require('./app/routes');
const { Sequelize } = require('sequelize');

const connection = new Sequelize('', 'root', '', {
  dialect: 'mysql',
  host: 'localhost',
  logging: false,
  define: {
    freezeTableName: true,
    timestamps: false,
  },
});

connection
  .query(`CREATE DATABASE IF NOT EXISTS messenger`)
  .then((res) => {
    if (res[0].affectedRows) {
      console.log('Database is not exists, it is created successful');
    }

    sequelize
      .sync({ alter: true })
      .then(() => {
        console.log('synced');
      })
      .catch((err) => {
        console.log(err);
      });

    connection.close();
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));
route(app);

app.listen(3000, () => {
  console.log('app is listening');
});

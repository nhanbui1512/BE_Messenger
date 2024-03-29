const express = require('express');
const { sequelize } = require('./app/models');
require('express-async-errors');

const app = express();
const path = require('path');
const route = require('./app/routes');
const { Sequelize } = require('sequelize');
const cors = require('cors');
const errorHandle = require('./app/middlewares/errorHandler');

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
      .authenticate()
      .then(() => {
        console.log('Connected to the database successfully');
      })
      .catch((err) => {
        console.log('Connected to the database unsuccessfully');
      });

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
app.use(cors());
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(express.static(path.join(__dirname, '/public')));

//config routes
route(app);

app.use(errorHandle);

app.listen(3000, () => {
  console.log('app is listening on http://localhost:3000');
});

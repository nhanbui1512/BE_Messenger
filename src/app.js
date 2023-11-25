const express = require("express");
const sequelize = require("./app/models");

const app = express();

sequelize
  .authenticate()
  .then(() => {
    console.log("connect to db successfully");
    sequelize.sync({
      alter: true,
    });
  })
  .catch((err) => {
    console.log(err.message);
  });

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(3000, () => {
  console.log("app is listening");
});

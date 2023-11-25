const express = require("express");
const { sequelize } = require("./app/models");
const app = express();
const path = require("path");
const route = require("./app/routes");

sequelize
  .authenticate()
  .then(async () => {
    console.log("Connect to db successfully");
    try {
      await sequelize.sync({
        alter: true,
      });
      console.log("synced");
    } catch (error) {
      console.log(error.message);
    }
  })
  .catch((err) => {
    console.log("Connect to DB is not successful");
    console.log(err.message);
  });

app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")));
route(app);

app.listen(3000, () => {
  console.log("app is listening");
});

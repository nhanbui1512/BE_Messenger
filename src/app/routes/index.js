const userRouter = require("./userRouter");
const roomRouter = require("./roomRouter");

function route(app) {
  app.use("/room", roomRouter);
  app.use("/user", userRouter);
}
module.exports = route;

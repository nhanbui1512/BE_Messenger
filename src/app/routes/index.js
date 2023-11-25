const userRouter = require("./userRouter");
const roomRouter = require("./roomRouter");
const messageRouter = require("./messageRouter");

function route(app) {
  app.use("/room", roomRouter);
  app.use("/user", userRouter);
  app.use("/message", messageRouter);
}
module.exports = route;

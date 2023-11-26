const userRouter = require('./userRouter');
const roomRouter = require('./roomRouter');
const messageRouter = require('./messageRouter');
const loginRouter = require('./loginRouter');
const isLoginMiddleware = require('../middlewares/isLoginMiddleware');

function route(app) {
  app.use('/room', roomRouter);
  app.use('/user', userRouter);
  app.use('/message', isLoginMiddleware, messageRouter);
  app.use('/login', loginRouter);
}
module.exports = route;

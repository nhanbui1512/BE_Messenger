const userRouter = require('./userRouter');
const roomRouter = require('./roomRouter');
const messageRouter = require('./messageRouter');
const loginRouter = require('./loginRouter');
const emotionRouter = require('./emotion');
const reactionRouter = require('./reaction');

const isLoginMiddleware = require('../middlewares/isLoginMiddleware');

function route(app) {
  app.use('/room', isLoginMiddleware, roomRouter);
  app.use('/user', isLoginMiddleware, userRouter);
  app.use('/message', isLoginMiddleware, messageRouter);
  app.use('/login', loginRouter);
  app.use('/emotion', emotionRouter);
  app.use('/reaction', isLoginMiddleware, reactionRouter);
}
module.exports = route;

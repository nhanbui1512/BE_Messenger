function errorHandle(err, req, response, next) {
  const devEnvironment = Boolean(process.env.DEV) || false;

  if (devEnvironment) {
    console.log('ERROR LOG: ', new Date().toLocaleDateString());
    console.log('ReqestL: ', req.method, req.originalUrl);
    console.log('Params: ', req.params);
    console.log('Body: ', req.body);
    console.log('Query: ', req.query);
    console.log('Error: ', err);
    console.log('Error stack: ', err.stack);
    console.log(
      '--------------------------------------------------------------------------------------------------------------------------------------------',
    );
  }

  const messageError = err.messageObject || err.message;
  const statusError = err.status || 400;

  console.log(messageError);
  const error = {
    status: statusError,
    error: messageError,
  };

  return response.status(statusError).json(error);
}
module.exports = errorHandle;

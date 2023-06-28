const errorHandler = (err, req, res, next) => {
  const { statusCode = 505, message } = err;
  res.status(statusCode).send({
    message: statusCode === 505 ? 'На сервере произошла ошибка' : message,
  });
  next();
};

module.exports = errorHandler;

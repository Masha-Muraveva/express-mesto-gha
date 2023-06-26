const jwt = require('jsonwebtoken');
const config = require('../config');
const Unauthorized = require('../Error/Unauthorized');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new Unauthorized('Необходимо зарегистрироваться'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, config.SECRET_KEY);
  } catch (err) {
    return next(new Unauthorized('Необходимо зарегистрироваться'));
  }
  req.user = payload;
  return next();
};

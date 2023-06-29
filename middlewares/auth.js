require('dotenv').config();

const jwt = require('jsonwebtoken');
const Unauthorized = require('../Error/Unauthorized');

const { NODE_ENV, JWT_SECRET } = process.env;

const extractBearerToken = (header) => {
  header.replace('Bearer ', '');
};

module.exports.checkAuthorizedUser = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Unauthorized('Вы не авторизованы, нельзя выполнить действие');
  }
  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');
  } catch (err) {
    throw new Unauthorized('Вы не авторизованы, нельзя выполнить действие');
  }
  req.user = payload;
  return next();
};

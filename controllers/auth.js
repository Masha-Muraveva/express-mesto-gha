require('dotenv').config();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const {
  CODE_CREATED,
} = require('../utils/constants');
const Unauthorized = require('../Error/Unauthorized');
const BadRequest = require('../Error/BadRequest');
const Conflict = require('../Error/Conflict');
// const config = require('../config');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(CODE_CREATED).send(
      {
        data: {
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
          _id: user._id,
        },
      },
    ))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new Conflict('Пользователь с такими данными уже существует'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Данные пользователя введены некоректно'));
      }
      return next(err);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User
    .findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Unauthorized('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Unauthorized('Неправильные почта или пароль'));
          }
          return res.send({
            token: jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', { expiresIn: '7d' }),
          });
        });
    })
    .catch((err) => {
      next(err);
    });
};

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const {
  CODE_CREATED,
} = require('../utils/constants');
const Unauthorized = require('../Error/Unauthorized');
const BadRequest = require('../Error/BadRequest');
const Conflict = require('../Error/Conflict');
const config = require('../config');

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
    .then((user) => {
      const { _id } = user;
      return res.status(CODE_CREATED).send({
        name,
        about,
        avatar,
        email,
        _id,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        throw new Conflict('Пользователь с такими данными уже существует');
      }
      throw new BadRequest('Данные пользователя введены некоректно');
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User
    .findUserByCredentials(email, password)
    .then(({ _id: userId }) => {
      const token = jwt.sign({ userId }, config.SECRET_KEY, { expiresIn: '7d' });
      return res.send({ token });
    })
    .catch(() => {
      next(new Unauthorized('Необходимо зарегистрироваться'));
    });
};

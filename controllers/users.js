const { ValidationError } = require('mongoose').Error;
const { CastError } = require('mongoose').Error;

const User = require('../models/user');

const BadRequest = require('../Error/BadRequest');
const NotFound = require('../Error/NotFound');

module.exports.getUsers = (req, res, next) => {
  User
    .find({})
    .then((users) => res.send({ users }))
    .catch(next);
};

const findUserById = (id) => User.findById(id).then((user) => {
  if (user) {
    return user;
  }
  throw new NotFound('Пользователь c указанным _id не найден');
});

module.exports.getUserId = (req, res, next) => {
  const { id } = req.params;
  findUserById(id)
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err instanceof CastError) {
        next(BadRequest('Переданы некорректные данные при поиске пользователя'));
      } else if (err.message === 'NotFound') {
        next(new NotFound('Пользователь c указанным _id не найден'));
      } else {
        next(err);
      }
    });
};

module.exports.getInfoProfile = (req, res, next) => {
  const { userId } = req.user;

  findUserById(userId)
    .then((user) => res.send({ user }))
    .catch(next);
};

const updateUserData = (userId, data) => User.findByIdAndUpdate(userId, data, {
  new: true,
  runValidators: true,
})
  .then((user) => {
    if (user) {
      return user;
    }
    throw new NotFound('Пользователь с указанным _id не найден');
  })
  .catch((err) => {
    if (err instanceof ValidationError) {
      throw new BadRequest('Переданы некорректные данные при обновлении информации');
    }
    throw err;
  });

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  const { userId } = req.user;

  updateUserData(userId, { name, about })
    .then((user) => res.send({ user }))
    .catch((err) => next(err));
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const { userId } = req.user;

  updateUserData(userId, { avatar })
    .then((user) => res.send({ user }))
    .catch((err) => next(err));
};

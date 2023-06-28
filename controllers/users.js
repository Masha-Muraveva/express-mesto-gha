const BadRequest = require('../Error/BadRequest');
const NotFound = require('../Error/NotFound');
const User = require('../models/user');
const ErrorHandler = require('../middlewares/errorHandler');

module.exports.getUsers = (req, res, next) => {
  User
    .find({})
    .then((data) => res.send({ data }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorHandler('Переданы некорректные данные'));
        return;
      }
      next(err);
    });
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
      if (err.name === 'CastError') {
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
    if (err.name === 'CastError') {
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

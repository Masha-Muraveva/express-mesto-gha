const usersRouter = require('express').Router();
const {
  updateProfileValidation,
  updateAvatarValidation,
  getIdValidation,
} = require('../validation/users');

const {
  getUsers,
  getUserId,
  getInfoProfile,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

usersRouter.get('/', getUsers);
usersRouter.get('/me', getInfoProfile);
usersRouter.get('/:userId', getIdValidation, getUserId);
usersRouter.patch('/me', updateProfileValidation, updateProfile);
usersRouter.patch('/me/avatar', updateAvatarValidation, updateAvatar);

module.exports = usersRouter;

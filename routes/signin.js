const signInRouter = require('express').Router();
const { signInValidation } = require('../validation/auth');
const { login } = require('../controllers/auth');

signInRouter.post('/signin', signInValidation, login);

module.exports = signInRouter;

const signUpRouter = require('express').Router();
const { signUpValidation } = require('../validation/auth');
const { createUser } = require('../controllers/auth');

signUpRouter.post('/signup', signUpValidation, createUser);

module.exports = signUpRouter;

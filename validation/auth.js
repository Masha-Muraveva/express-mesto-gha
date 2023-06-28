const { celebrate, Joi } = require('celebrate');
const config = require('../config');

const signInValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const signUpValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(config.URL_REGEX),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

module.exports = {
  signInValidation,
  signUpValidation,
};

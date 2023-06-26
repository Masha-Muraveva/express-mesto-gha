const { celebrate, Joi } = require('celebrate');
const config = require('../config');

const updateProfileValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

const updateAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(config.URL_REGEX).required(),
  }),
});

const getIdValidation = celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
});

module.exports = {
  updateProfileValidation,
  updateAvatarValidation,
  getIdValidation,
};

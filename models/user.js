const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'Жак-Ив Кусто',
      minlength: 2,
      maxlength: 30,
    },
    about: {
      type: String,
      default: 'Исследователь',
      minlength: 2,
      maxlength: 30,
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator: (url) => validator.isURL(url),
        message: 'Здесь должна быть указана ссылка (URL)',
      },
    },
    email: {
      type: String,
      required: [true, 'Данное поле должно быть заполнено'],
      unique: true,
      validate: {
        validator: (email) => validator.isEmail(email),
        message: 'Здесь должен быть указан электронный адрес',
      },
    },
    password: {
      type: String,
      required: [true, 'Данное поле должно быть заполнено'],
      select: false,
    },
  },
  {
    versionKey: false,
    statics: {
      findUserByCredentials(email, password) {
        return this.findOne({ email })
          .select('+password')
          .then((user) => {
            if (user) {
              return bcrypt.compare(password, user.password).then((matched) => {
                if (matched) {
                  return user;
                }
                throw new Error('Неправильные данные: почта или пароль');
              });
            }
            throw new Error('Неправильные данные: почта или пароль');
          });
      },
    },
  },
);

module.exports = mongoose.model('user', userSchema);

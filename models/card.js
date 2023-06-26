const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    validate: {
      validator: ({ length }) => length >= 2 && length <= 30,
      message: 'Имя карточки должно быть длиной от 2 до 30 символов',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: 'user',
  },
  link: {
    type: String,
    require: true,
    validate: {
      validator: (url) => validator.isURL(url),
      message: 'Здесь должна быть указана ссылка (URL)',
    },
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });

module.exports = mongoose.model('card', cardSchema);

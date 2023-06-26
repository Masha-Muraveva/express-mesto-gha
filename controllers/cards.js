const { ValidationError } = require('mongoose').Error;
const { CastError } = require('mongoose').Error;

const Forbidden = require('../Error/Forbidden');
const NotFound = require('../Error/NotFound');
const BadRequest = require('../Error/BadRequest');

const Card = require('../models/card');
const {
  CODE_CREATED,
} = require('../utils/constants');

module.exports.getCards = (req, res, next) => {
  Card
    .find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { userId } = req.user;

  Card
    .create({ name, link, owner: userId })
    .then((card) => card.populate('owner'))
    .then((card) => res.status(CODE_CREATED).send({ data: card }))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(
          new BadRequest('Переданы некорректные данные при создании карточки'),
        );
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { id: cardId } = req.params;
  const { userId } = req.user;

  Card
    .findById({ _id: cardId })
    .then((card) => {
      if (!card) {
        throw new NotFound('Карточка с указанным _id не найдена');
      }
      const { owner: cardOwnerId } = card;
      if (cardOwnerId.valueOf() !== userId) {
        throw new Forbidden('Нет доступа для удаления данной карточки - её создал другой пользователь');
      }
      return Card.findByIdAndDelete(cardId);
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;
  const { userId } = req.user;

  Card
    .findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true },
    )
    .then((card) => {
      if (card) {
        return res.send({ data: card });
      }
      throw new NotFound('Карточка с указанным _id не найдена');
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequest('Переданы некорректные данные для постановки/снятия лайка'));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const { userId } = req.user;

  Card
    .findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true },
    )
    .then((card) => {
      if (card) {
        return res.send({ data: card });
      }
      throw new NotFound('Карточка с указанным _id не найдена');
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequest('Переданы некорректные данные для постановки/снятия лайка'));
      } else {
        next(err);
      }
    });
};

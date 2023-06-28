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
  const owner = req.user._id;

  Card
    .create({ name, link, owner })
    .then((card) => card.populate('owner'))
    .then((card) => res.status(CODE_CREATED).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequest('Переданы некорректные данные при создании карточки'),
        );
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card
    .findById(req.params.cardId)
    .orFail(() => {
      throw new NotFound('Карточка с указанным _id не найдена');
    })
    .then((card) => {
      const owner = card.owner.toString();
      if (req.user._id === owner) {
        Card.deleteOne(card)
          .then(() => {
            res.send(card);
          })
          .catch(next);
      } else {
        throw new Forbidden('Нет доступа для удаления данной карточки - её создал другой пользователь');
      }
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные удаления'));
      } else {
        next(e);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        throw new NotFound('Карточка с указанным _id не найдена');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest('Переданы некорректные данные для постановки/снятия лайка'));
      }
      return next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        throw new NotFound('Карточка с указанным _id не найдена');
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest('Переданы некорректные данные для постановки/снятия лайка'));
      }
      return next(err);
    });
};

const cardsRouter = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const {
  creationCardValidation,
  deletionCardValidation,
  likeCardValidation,
  dislikeCardValidation,
} = require('../validation/cards');

cardsRouter.get('/', getCards);
cardsRouter.post('/', creationCardValidation, createCard);
cardsRouter.delete('/:cardId', deletionCardValidation, deleteCard);
cardsRouter.put('/:cardId/likes', likeCardValidation, likeCard);
cardsRouter.delete('/:cardId/likes', dislikeCardValidation, dislikeCard);

module.exports = cardsRouter;

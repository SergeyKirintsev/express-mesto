const router = require('express').Router();

const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.delete('/:cardId/likes', dislikeCard);

router.put('/:cardId/likes', likeCard);

router.delete('/:cardId', deleteCard);

router.get('/', getCards);

router.post('/', createCard);

module.exports = router;

const Card = require('../models/card');
const { makeNotFounError, checkErrors } = require('../utils/utils');

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((data) => res.send({ data }))
    .catch((err) => {
      checkErrors(err, res, {
        msgValidationError: 'Переданы некорректные данные при создании карточки',
      });
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((data) => res.send({ data }))
    .catch((err) => checkErrors(err, res));
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.deleteOne({ _id: cardId })
    .orFail(() => makeNotFounError())
    .then((data) => res.send({ data }))
    .catch((err) => {
      checkErrors(err, res, {
        msgNotFound: 'Карточка с указанным _id не найдена',
        msgCastError: 'Невалидный id карточки',
      });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => makeNotFounError())
    .then((data) => res.send({ data }))
    .catch((err) => {
      checkErrors(err, res, {
        msgNotFound: 'Карточка с указанным _id не найдена',
        msgCastError: 'Переданы некорректные данные для постановки лайка',
      });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => makeNotFounError())
    .then((data) => res.send({ data }))
    .catch((err) => {
      checkErrors(err, res, {
        msgNotFound: 'Карточка с указанным _id не найдена',
        msgCastError: 'Переданы некорректные данные для снятия лайка',
      });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};

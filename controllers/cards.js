const Card = require('../models/card');
const { VALIDATION_ERROR_CODE, CAST_ERROR_CODE } = require('../utils/utils');

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((data) => res.send({ data }))
    .catch((err) => {
      if (err.name === 'CastError') return res.status(CAST_ERROR_CODE).send({ message: 'Карчточка не найдена' });
      if (err.name === 'ValidationError') return res.status(VALIDATION_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании карточки.' });
      return res.status(500).send({ message: 'Ошибка на сервере' });
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((data) => res.send({ data }))
    .catch((err) => {
      if (err.name === 'CastError') return res.status(CAST_ERROR_CODE).send({ message: 'Карчточка не найдена' });
      if (err.name === 'ValidationError') return res.status(VALIDATION_ERROR_CODE).send({ message: ' Переданы некорректные данные' });
      return res.status(500).send({ message: 'Ошибка на сервере' });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.deleteOne({ _id: cardId })
    .then((data) => res.send({ data }))
    .catch((err) => {
      if (err.name === 'CastError') return res.status(CAST_ERROR_CODE).send({ message: 'Карточка с указанным _id не найдена.' });
      if (err.name === 'ValidationError') return res.status(VALIDATION_ERROR_CODE).send({ message: ' Переданы некорректные данные' });
      return res.status(500).send({ message: 'Ошибка на сервере' });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((data) => res.send({ data }))
    .catch((err) => {
      if (err.name === 'CastError') return res.status(CAST_ERROR_CODE).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      return res.status(500).send({ message: 'Ошибка на сервере' });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((data) => res.send({ data }))
    .catch((err) => {
      if (err.name === 'CastError') return res.status(CAST_ERROR_CODE).send({ message: 'Переданы некорректные данные для снятия лайка.' });
      return res.status(500).send({ message: 'Ошибка на сервере' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};

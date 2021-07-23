const Card = require('../models/card');
const { VALIDATION_ERROR_CODE, CAST_ERROR_CODE } = require('../utils/utils');

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      console.log(err.name);
      if (err.name === 'CastError') return res.status(CAST_ERROR_CODE).send({ message: 'Карчточка не найдена' });
      if (err.name === 'ValidationError') return res.status(VALIDATION_ERROR_CODE).send({ message: ' Переданы некорректные данные' });
      return res.status(500).send({ message: 'Ошибка на сервере' });
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => {
      console.log(err.name);
      if (err.name === 'CastError') return res.status(CAST_ERROR_CODE).send({ message: 'Карчточка не найдена' });
      if (err.name === 'ValidationError') return res.status(VALIDATION_ERROR_CODE).send({ message: ' Переданы некорректные данные' });
      return res.status(500).send({ message: 'Ошибка на сервере' });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.deleteOne({ _id: cardId })
    .then((card) => res.send(card))
    .catch((err) => {
      console.log(err.name);
      if (err.name === 'CastError') return res.status(CAST_ERROR_CODE).send({ message: 'Карчточка не найдена' });
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
    .then((user) => res.send(user))
    .catch((err) => {
      console.log(err.name);
      if (err.name === 'CastError') return res.status(CAST_ERROR_CODE).send({ message: 'Карчточка не найдена' });
      if (err.name === 'ValidationError') return res.status(VALIDATION_ERROR_CODE).send({ message: ' Переданы некорректные данные' });
      return res.status(500).send({ message: 'Ошибка на сервере' });
    });
};

const dislikeCard = (req, res) => {
  console.log('dislikeCard');
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      console.log(err.name);
      if (err.name === 'CastError') return res.status(CAST_ERROR_CODE).send({ message: 'Карчточка не найдена' });
      if (err.name === 'ValidationError') return res.status(VALIDATION_ERROR_CODE).send({ message: ' Переданы некорректные данные' });
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

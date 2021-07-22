const Card = require('../models/card');

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch(() => res.status(500).send({ message: 'Карчтока не создана' }));
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: 'Ошибка получения' }));
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.deleteOne({ _id: cardId })
    .then((card) => res.send(card))
    .catch(() => res.status(500).send({ message: 'Карчтока не удалена' }));
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((user) => res.send(user))
    .catch(() => res.status(500).send({ message: 'Пользователь не найден' }));
};

const dislikeCard = (req, res) => {
  console.log('dislikeCard');
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((user) => res.send(user))
    .catch(() => res.status(500).send({ message: 'Пользователь не найден' }));
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};

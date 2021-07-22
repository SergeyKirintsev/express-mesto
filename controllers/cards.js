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

module.exports = {
  getCards,
  createCard,
  deleteCard,
};

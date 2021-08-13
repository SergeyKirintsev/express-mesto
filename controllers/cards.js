const Card = require('../models/card');
const { NotFoundError } = require('../errors/not-found-err');
const { CastError } = require('../errors/cast-err');
const { ValidationError } = require('../errors/validation-err');
const { ForbiddenError } = require('../errors/forbidden-err');

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((data) => res.send({ data }))
    .catch(() => {
      throw new ValidationError('Переданы некорректные данные при создании карточки');
    })
    .catch(next);
};

const getCards = (req, res, next) => {
  Card.find({})
    .then((data) => res.send({ data }))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const currentUser = req.user._id;
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail(() => next(new NotFoundError('Карточка с указанным _id не найдена!!')))
    .then((card) => {
      if (!card.owner.equals(currentUser)) {
        next(new ForbiddenError('Вы не имеет права удалить карточку'));
      } else {
        Card.findByIdAndRemove(cardId)
          .then((data) => res.send({
            data,
            message: 'Карточка удалена',
          }))
          .catch(next);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') next(new CastError('Невалидный id карточки'));
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => { throw new NotFoundError('Карточка с указанным _id не найдена'); })
    .then((data) => res.send({ data }))
    .catch(() => { throw new CastError('Переданы некорректные данные для постановки лайка'); })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => { throw new NotFoundError('Карточка с указанным _id не найдена'); })
    .then((data) => res.send({ data }))
    .catch(() => { throw new CastError('Переданы некорректные данные для снятия лайка'); })
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};

const User = require('../models/user');
const { makeNotFounError, checkErrors } = require('../utils/utils');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((data) => res.send({ data }))
    .catch((err) => {
      checkErrors(err, res, {
        msgValidationError: 'Переданы некорректные данные при создании пользователя',
      });
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((data) => res.send({ data }))
    .catch((err) => checkErrors(err, res));
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => makeNotFounError())
    .then((data) => res.send({ data }))
    .catch((err) => {
      checkErrors(err, res, {
        msgNotFound: 'Пользователь по указанному _id не найден',
        msgCastError: 'Невалидный id пользователя',
      });
    });
};

const updateProfile = (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .orFail(() => makeNotFounError())
    .then((data) => res.send({ data }))
    .catch((err) => {
      checkErrors(err, res, {
        msgNotFound: 'Пользователь с указанным _id не найден',
        msgCastError: 'Невалидный id пользователя',
        msgValidationError: 'Переданы некорректные данные при обновлении профиля',
      });
    });
};

const updateAvatar = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { avatar },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .orFail(() => makeNotFounError())
    .then((data) => res.send({ data }))
    .catch((err) => {
      checkErrors(err, res, {
        msgNotFound: 'Пользователь с указанным _id не найден',
        msgCastError: 'Невалидный id пользователя',
        msgValidationError: 'Переданы некорректные данные при обновлении аватара',
      });
    });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
};

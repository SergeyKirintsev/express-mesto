const User = require('../models/user');
const { VALIDATION_ERROR_CODE, CAST_ERROR_CODE } = require('../utils/utils');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((data) => res.send({ data }))
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(VALIDATION_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании пользователя' });
      return res.status(500).send({ message: 'Ошибка на сервере' });
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((data) => res.send({ data }))
    .catch(() => res.status(500).send({ message: 'Ошибка на сервере' }));
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((data) => res.send({ data }))
    .catch((err) => {
      if (err.name === 'CastError') return res.status(CAST_ERROR_CODE).send({ message: 'Пользователь по указанному _id не найден.' });
      return res.status(500).send({ message: 'Ошибка на сервере' });
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
    .then((data) => res.send({ data }))
    .catch((err) => {
      if (err.name === 'CastError') return res.status(CAST_ERROR_CODE).send({ message: 'Пользователь с указанным _id не найден.' });
      if (err.name === 'ValidationError') return res.status(VALIDATION_ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      return res.status(500).send({ message: 'Ошибка на сервере' });
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
    .then((data) => res.send({ data }))
    .catch((err) => {
      if (err.name === 'CastError') return res.status(CAST_ERROR_CODE).send({ message: 'Пользователь с указанным _id не найден.' });
      if (err.name === 'ValidationError') return res.status(VALIDATION_ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      return res.status(500).send({ message: 'Ошибка на сервере' });
    });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
};

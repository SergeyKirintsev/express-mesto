const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { makeNotFounError, checkErrors } = require('../utils/utils');

const getProfile = (req, res) => {
  console.log(req.user._id);
  res.send({ message: 'getProfile' });
}

const login = (req, res) => {
  const { email, password } = req.body;
  const { NODE_ENV, JWT_SECRET, JWT_DEV } = process.env;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : JWT_DEV,
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          // token - наш JWT токен, который мы отправляем
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .end();
    })
    .catch((err) => {
      // ошибка аутентификации
      res
        .status(401)
        .send({ message: err.message });
    });
};

const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
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
  const userId = req.user._id;
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
  login,
  getProfile,
};

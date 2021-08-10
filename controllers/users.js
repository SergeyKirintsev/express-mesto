const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { NotFoundError } = require('../errors/not-found-err');
const { CastError } = require('../errors/cast-err');
const { ExistFieldError } = require('../errors/exist-field-err');

const login = (req, res, next) => {
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
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((data) => res.send({
      data: {
        name: data.name,
        about: data.about,
        avatar: data.avatar,
        email: data.email,
      },
    }))
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        throw new ExistFieldError('Email уже существует');
      }
      next(err);
    })
    .catch(next);
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((data) => res.send({ data }))
    .catch(next);
};

const getUserById = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail(() => { throw new NotFoundError('Пользователь по указанному _id не найден'); })
    .then((data) => res.send({ data }))
    .catch(() => { throw new CastError('Невалидный id пользователя'); })
    .catch(next);
};

const updateProfile = (req, res, next) => {
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
    .orFail(() => { throw new NotFoundError('Пользователь с указанным _id не найден'); })
    .then((data) => res.send({ data }))
    .catch(() => { throw new CastError('Невалидный id пользователя'); })
    .catch(next);
};

const updateAvatar = (req, res, next) => {
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
    .orFail(() => { throw new NotFoundError('Пользователь с указанным _id не найден'); })
    .then((data) => res.send({ data }))
    .catch(() => { throw new CastError('Невалидный id пользователя'); })
    .catch(next);
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  login,
};

const User = require('../models/user');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch(() => res.status(500).send({ message: 'Пользователь не создан' }));
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'Ошибка' }));
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => res.send(user))
    .catch(() => res.status(500).send({ message: 'Пользователь не найден' }));
};

const updateProfile = (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  console.log(userId);
  console.log(name, about);

  User.findByIdAndUpdate(
    userId,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      upsert: true, // если пользователь не найден, он будет создан
    },
  )
    .then((user) => res.send(user))
    .catch(() => res.status(500).send({ message: 'Пользователь не найден' }));
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
      upsert: true, // если пользователь не найден, он будет создан
    },
  )
    .then((user) => res.send(user))
    .catch(() => res.status(500).send({ message: 'Пользователь не найден' }));
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
};

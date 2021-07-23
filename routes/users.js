const router = require('express').Router();

const {
  createUser,
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.patch('/me/avatar', updateAvatar);

router.patch('/me', updateProfile);

router.get('/:userId', getUserById);

router.get('/', getUsers);

router.post('/', createUser);

module.exports = router;

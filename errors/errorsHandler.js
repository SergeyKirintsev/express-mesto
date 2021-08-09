const { castErrorConfig } = require('./cast-err');
const { notFoundErrorConfig } = require('./not-found-err');
const { validationErrorConfig } = require('./validation-err');
const { authErrorConfig } = require('./auth-err');

function defaultServerError(res) {
  res.status(500).send({ message: 'На сервере произошла ошибка' });
}

module.exports = (err, req, res, next) => {
  switch (err.name) {
    case castErrorConfig.name:
      res.status(castErrorConfig.code).send({ message: err.message });
      break;
    case notFoundErrorConfig.name:
      res.status(notFoundErrorConfig.code).send({ message: err.message });
      break;
    case validationErrorConfig.name:
      res.status(validationErrorConfig.code).send({ message: err.message });
      break;
    case authErrorConfig.name:
      res.status(authErrorConfig.code).send({ message: err.message });
      break;
    case 'MongoError':
      switch (err.code) {
        case 11000:
          res.status(409).send({ message: 'Email уже есть в базе' });
          break;
        default:
          defaultServerError(res);
      }
      break;
    default:
      defaultServerError(res);
  }

  next();
};

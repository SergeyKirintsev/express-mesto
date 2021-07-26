const VALIDATION_ERROR_CODE = 400;
const CAST_ERROR_CODE = 400;
const NOT_FOUND_ERROR_CODE = 404;

function makeNotFounError() {
  const error = new Error();
  error.name = 'NotFound';
  throw error;
}

function checkErrors(err, res, messages = {}) {
  const msgNotFound = messages.msgNotFound || 'Поиск по id не дал результатов';
  const msgCastError = messages.msgCastError || 'Невалидный id';
  const msgValidationError = messages.msgValidationError || 'Переданы некорректные данные';

  if (err.name === 'NotFound') return res.status(NOT_FOUND_ERROR_CODE).send({ message: msgNotFound });
  if (err.name === 'CastError') return res.status(CAST_ERROR_CODE).send({ message: msgCastError });
  if (err.name === 'ValidationError') return res.status(VALIDATION_ERROR_CODE).send({ message: msgValidationError });

  return res.status(500).send({ message: 'Ошибка на сервере' });
}

module.exports = {
  makeNotFounError,
  checkErrors,
};

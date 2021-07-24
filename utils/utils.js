const VALIDATION_ERROR_CODE = 400;
const CAST_ERROR_CODE = 404;

function makeCastError() {
  const error = new Error();
  error.name = 'CastError';
  throw error;
}

module.exports = {
  VALIDATION_ERROR_CODE,
  CAST_ERROR_CODE,
  makeCastError,
};

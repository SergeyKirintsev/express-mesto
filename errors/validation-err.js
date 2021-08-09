const validationErrorConfig = {
  code: 400,
  name: 'ValidationError',
};

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = validationErrorConfig.code;
    this.name = validationErrorConfig.name;
  }
}

module.exports = {
  validationErrorConfig,
  ValidationError,
};

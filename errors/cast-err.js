const castErrorConfig = {
  code: 400,
  name: 'CastError',
};

class CastError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = castErrorConfig.code;
    this.name = castErrorConfig.name;
  }
}

module.exports = {
  castErrorConfig,
  CastError,
};

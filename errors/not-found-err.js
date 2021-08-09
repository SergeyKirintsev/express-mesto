const notFoundErrorConfig = {
  code: 404,
  name: 'NotFound',
};

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = notFoundErrorConfig.code;
    this.name = notFoundErrorConfig.name;
  }
}

module.exports = {
  notFoundErrorConfig,
  NotFoundError,
};

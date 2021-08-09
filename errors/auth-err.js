const authErrorConfig = {
  code: 401,
  name: 'authError',
};

class AuthError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = authErrorConfig.code;
    this.name = authErrorConfig.name;
  }
}

module.exports = {
  authErrorConfig,
  AuthError,
};

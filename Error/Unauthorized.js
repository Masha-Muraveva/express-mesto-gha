const { ERROR_UNAUTHORIZED } = require('../utils/constants');

class Unauthorized extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_UNAUTHORIZED;
  }
}

module.exports = Unauthorized;

const { ERROR_INTERNAL_SERVER } = require('../utils/constants');

class InternalServer extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_INTERNAL_SERVER;
  }
}

module.exports = InternalServer;

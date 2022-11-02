class CurrentPositionIsRequired extends Error {
  constructor(message = 'Current position is required', code = 400) {
    super();
    this.message = message;
    this.statusCode = code;
  }
}

class FeeNotFound extends Error {
  constructor(message = 'Fee not found', code = 400) {
    super();
    this.message = message;
    this.statusCode = code;
  }
}
module.exports = { CurrentPositionIsRequired, FeeNotFound };
class CurrentPositionIsRequired extends Error {
  constructor(message = 'Current position is required', code = 400) {
    super();
    this.message = message;
    this.statusCode = code;
  }
}

module.exports = { CurrentPositionIsRequired };
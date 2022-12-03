module.exports = err => {
  if (err.statusCode === undefined) {
    return { statusCode: 500, message: 'Unexpected Error' };
  }
  return { statusCode: err.statusCode, message: err.message };
};

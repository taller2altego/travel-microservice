module.exports = err => {
  if (err.statusCode === undefined) {
    return { statusCode: 500, message: 'Unexpected Error' };
  } else {
    return { statusCode: err.statusCode, message: err.message };
  }
}
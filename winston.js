var path = require('path');
const { createLogger, format, transports } = require('winston');
const { combine, splat, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}] : ${message} `
  if (metadata) {
    msg += JSON.stringify(metadata)
  }
  return msg
});

const level = process.env.NODE_ENV === 'production' ? 'error' : 'debug';
const ownFormat = combine(format.colorize(), splat(), timestamp(), myFormat);
const logger = createLogger({ level, format: ownFormat, transports: [new transports.Console({ level })] });

module.exports = logger;
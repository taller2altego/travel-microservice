var path = require('path');
// const filename = `${path.resolve(__dirname, '/combined.log')}`;
// console.log(filename);

const { createLogger, format, transports } = require('winston');
const { combine, splat, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}] : ${message} `
  if (metadata) {
    msg += JSON.stringify(metadata)
  }
  return msg
});

const logger = createLogger({
  level: 'debug',
  format: combine(
    format.colorize(),
    splat(),
    timestamp(),
    myFormat
  ),
  transports: [
    new transports.Console({ level: 'info' })
    // new transports.File({ filename: "/usr/src/app/combined.log", level: 'info' }),
  ]
});

module.exports = logger;
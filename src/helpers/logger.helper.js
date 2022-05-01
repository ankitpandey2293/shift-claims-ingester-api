const winston = require('winston');
const baseServiceName = 'customer-api';

exports.getLoggerInstance = (featureName = 'all', level = 'info') => {
  let logger = winston.createLogger({
    level: level,
    format: winston.format.json(),
    defaultMeta: { service: `${baseServiceName}-${featureName}` },
    transports: [
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'debug.log', level: 'info' }),
    ],
  });

  if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.simple(),
    }));
  }
  return logger;
}


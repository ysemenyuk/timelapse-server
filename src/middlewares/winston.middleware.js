import { v4 as uuidv4 } from 'uuid';
import winston from 'winston';

const { createLogger, format, transports } = winston;

const logConfiguration = {
  transports: [new transports.Console()],
  format: format.combine(
    format.colorize(),
    format.simple(),
    format.timestamp({ format: 'YYYY/MM/DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.label({ label: `timelapse🏷️` }),
    format.prettyPrint(),
    format.printf((info) => `${info.level} - ${[info.timestamp]}  ${info.requestId || ''} - ${info.message}`)
  ),
};

const logger = createLogger(logConfiguration);

export default (req, res, next) => {
  const requestId = uuidv4();

  req.requestId = requestId;
  req.winston = logger.child({ requestId });

  req.reqLogger = (message) => req.winston.info(message);

  req.resLogger = (req) => req.winston.info(`RES: ${req.method} -${req.originalUrl} -${res.statusCode}`);

  req.reqLogger(`REQ: ${req.method} -${req.originalUrl}`);

  next();
};

import { v4 as uuidv4 } from 'uuid';
import winston from 'winston';
// import colors from 'colors';

const { createLogger, format, transports } = winston;

const logConfiguration = {
  transports: [new transports.Console()],
  format: format.combine(
    format.colorize(),
    format.simple()
    // format.timestamp({ format: 'YYYY/MM/DD HH:mm:ss' }),
    // format.errors({ stack: true }),
    // format.label({ label: `timelapse🏷️` }),
    // format.prettyPrint()
    // format.printf(
    //   (info) => `${info.level} - ${[info.timestamp]}  ${info.requestId || ''} - ${info.message}`
    // )
  ),
};

const logger = createLogger(logConfiguration);

export default (req, res, next) => {
  const requestId = uuidv4();

  req.requestId = requestId;
  req.winston = logger.child({ requestId });

  req.logger = (message) => req.winston.info(message);

  req.logResp = (req) => req.winston.info(`RES: ${req.method} -${req.originalUrl} -${res.statusCode}`);

  // req.logger(`REQ: ${req.method} - ${req.originalUrl}`);

  next();
};

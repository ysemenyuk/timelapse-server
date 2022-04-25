import { v4 as uuidv4 } from 'uuid';
import logger from '../libs/logger.js';

export default (req, res, next) => {
  const requestId = uuidv4();

  req.requestId = requestId;
  req.winston = logger.child({ requestId });

  req.logger = (message) => req.winston.info(message);

  req.logResp = (req) => req.winston.info(`RES: ${req.method} -${req.originalUrl} -${res.statusCode}`);

  // req.logger(`REQ: ${req.method} - ${req.originalUrl}`);

  next();
};

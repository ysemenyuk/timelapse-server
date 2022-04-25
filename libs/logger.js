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

export default logger;

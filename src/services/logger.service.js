import debug from 'debug';

export default class LoggerService {
  constructor(config) {
    this.mode = config.mode;
  }

  createLogger(name) {
    if (this.mode === 'test') {
      return () => {};
    }

    return debug(name);
  }

  setTestMode() {
    this.mode = 'test';
  }
}

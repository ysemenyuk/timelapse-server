export default class Container {
  constructor() {
    this.services = {};
  }

  register(name, cb) {
    Object.defineProperty(this, name, {
      get: () => {
        // eslint-disable-next-line no-prototype-builtins
        if (!this.services.hasOwnProperty(name)) {
          this.services[name] = cb(this);
        }

        return this.services[name];
      },
      configurable: true,
      enumerable: true,
    });

    return this;
  }
}

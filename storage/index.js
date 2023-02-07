import cloudStorage from './cloud.storage.js';
import diskStorage from './disk.storage.js';
import gridfsStorage from './gridfs.storage.js';

const storageType = process.env.STORAGE_TYPE;

console.log(44444, storageType);

class Storage {
  constructor() {
    this.storage;
  }

  get instance() {
    return this.storage;
  }

  async start(mongoClient) {
    console.log(33333, 'storage start');

    const mapping = {
      disk: diskStorage,
      cloud: cloudStorage,
      gridfs: gridfsStorage(mongoClient),
    };

    this.storage = mapping[storageType];

    // console.log(33333, this.storage);
  }
}

export default new Storage();

// export default mapping[storageType];

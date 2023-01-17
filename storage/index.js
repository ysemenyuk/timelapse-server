import cloudStorage from './cloud.storage.js';
import diskStorage from './disk.storage.js';

const storageType = process.env.STORAGE_TYPE;

const mapping = {
  disk: diskStorage,
  cloud: cloudStorage,
};

export default mapping[storageType];

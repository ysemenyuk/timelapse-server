import DiskStorage from './disk.storage.js';
import GridfsStorage from './gridfs.storage.js';

const storageType = process.env.STORAGE_TYPE;

const mapping = {
  disk: DiskStorage,
  gridfs: GridfsStorage,
};

const storage = new mapping[storageType]();

export default storage;

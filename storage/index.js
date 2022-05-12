import diskStorage from './disk.storage.js';
import gridFsStorage from './gridFS.storage.js';

const storageType = process.env.STORAGE_TYPE;
console.log('storageType', storageType);

export default async () => {
  const storages = {
    disk: diskStorage,
    gridfs: gridFsStorage,
  };

  return await storages[storageType]();
};

import { taskName } from './utils/constants.js';
const { CREATE_PHOTO, CREATE_VIDEO, CREATE_PHOTOS_BY_TIME, CREATE_VIDEOS_BY_TIME } = taskName;

export default {
  jobTypesToStart: [CREATE_PHOTO, CREATE_VIDEO, CREATE_PHOTOS_BY_TIME, CREATE_VIDEOS_BY_TIME],

  storageType: process.env.STORAGE_TYPE,
  pathToDiskSpace: process.env.DISK_PATH,

  mode: process.env.NODE_ENV,
  serverPort: process.env.SERVER_PORT,
  workerPort: process.env.WORKER_PORT,

  dbUri: process.env.MONGO_URI,
  dbName: process.env.MONGO_DB_NAME,

  gridfsDbUri: process.env.MONGO_URI,
  gridfsDbName: process.env.MONGO_GRIDFS_DB_NAME,

  secretkey: process.env.SECRET_KEY,
  weatherApiKey: process.env.WEATHER_API_KEY,
};

import { taskName } from './utils/constants.js';
const {
  CREATE_PHOTO,
  CREATE_VIDEO,
  CREATE_PHOTOS_BY_TIME,
  CREATE_VIDEOS_BY_TIME,
} = taskName;

export default {
  jobTypesToStart: [
    CREATE_PHOTO,
    CREATE_VIDEO,
    CREATE_PHOTOS_BY_TIME,
    CREATE_VIDEOS_BY_TIME,
  ],

  storageType: process.env.STORAGE_TYPE,
  pathToDiskSpace: process.env.DISK_PATH,

  mode: process.env.NODE_ENV,
  port: process.env.PORT,

  dbUri: process.env.MONGO_URI,
  gridfsDbName: process.env.MONGO_GRIDFS_DB_NAME,
  agendaDbName: process.env.MONGO_AGENDA_DB_NAME,

  secretkey: process.env.SECRET_KEY,
  weatherApiKey: process.env.WEATHER_API_KEY,
};

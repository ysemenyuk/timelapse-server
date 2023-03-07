export default {
  storageType: process.env.STORAGE_TYPE,
  pathToDiskSpace: process.env.DISK_PATH,
  mode: process.env.NODE_ENV,
  serverPort: process.env.SERVER_PORT,
  workerPort: process.env.WORKER_PORT,
  dbUri: process.env.MONGO_URI,
  dbName: process.env.MONGO_DB_NAME,
  secretkey: process.env.SECRET_KEY,
  weatherApiKey: process.env.WEATHER_API_KEY,
};

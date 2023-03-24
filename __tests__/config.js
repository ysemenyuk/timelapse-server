export default {
  jobTypesToStart: [],

  port: process.env.TEST_PORT,
  mode: process.env.TEST_NODE_ENV,

  dbUri: process.env.TEST_MONGO_URI,
  dbName: process.env.TEST_MONGO_DB_NAME,
  gridfsDbName: process.env.TEST_MONGO_GRIDFS_DB_NAME,
  agendaDbName: process.env.TEST_MONGO_AGENDA_DB_NAME,

  secretkey: process.env.TEST_SECRET_KEY,
};

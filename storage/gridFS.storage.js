import mongodb from 'mongodb';
const dbUri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB_NAME;

export default async () => {
  const { MongoClient } = mongodb;

  const mongoClient = new MongoClient(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await mongoClient.connect();

  console.log(`MongoClient successfully Connected`);
  logger(`MongoClient successfully Connected`);

  const database = mongoClient.db(dbName);
  const bucket = new mongodb.GridFSBucket(database);

  const openUploadStream = ({ fileName, logger }) => {
    logger(`gridFs.storage.openUploadStream fileName: ${fileName}`);

    // const database = mongoClient.db(dbName);
    // const bucket = new mongodb.GridFSBucket(database);

    const uploadStream = bucket.openUploadStream(fileName);
    return uploadStream;
  };

  const openDownloadStream = ({ file, logger }) => {
    logger(`gridFs.storage.openDownloadStream file.name isThumbnail: ${file.name}`);

    if (!file.name) {
      throw new Error('gridFs.storage.openDownloadStream have not file.name');
    }

    // const database = mongoClient.db(dbName);
    // const bucket = new mongodb.GridFSBucket(database);

    const downloadStream = bucket.openDownloadStreamByName(file.name);
    return downloadStream;
  };

  const deleteOne = ({ file, logger }) => {
    logger(`gridFs.storage.deleteOne file.name: ${file.name}`);

    // return bucket.delete(file);
  };

  return { openUploadStream, openDownloadStream, deleteOne, type: 'gridfs' };
};

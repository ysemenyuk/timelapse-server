import mongodb from 'mongodb';

export default (mongoClient) => {
  // console.log(111111, bucket);

  const openUploadStream = ({ fileName, logger }) => {
    logger(`gridFs.storage.openUploadStream fileName: ${fileName}`);

    const database = mongoClient.db('myFirstDatabase');
    const bucket = new mongodb.GridFSBucket(database);

    const uploadStream = bucket.openUploadStream(fileName);
    return uploadStream;
  };

  const openDownloadStream = ({ file, logger }) => {
    logger(`gridFs.storage.openDownloadStream file.name isThumbnail: ${file.name}`);

    if (!file.name) {
      throw new Error('gridFs.storage.openDownloadStream have not file.name');
    }

    const database = mongoClient.db('myFirstDatabase');
    const bucket = new mongodb.GridFSBucket(database);

    const downloadStream = bucket.openDownloadStreamByName(file.name);
    return downloadStream;
  };

  const deleteOne = ({ file, logger }) => {
    logger(`gridFs.storage.deleteOne file.name: ${file.name}`);

    // return bucket.delete(file);
  };

  return { openUploadStream, openDownloadStream, deleteOne, type: 'gridfs' };
};

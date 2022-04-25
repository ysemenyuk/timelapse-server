import { createReadStream } from 'fs';
import S3 from 'aws-sdk/clients/s3.js';

// s3
const ID = process.env.ID;
const SECRET = process.env.SECRET;
const BUCKET_NAME = process.env.BUCKET_NAME;

const s3 = new S3({
  accessKeyId: ID,
  secretAccessKey: SECRET,
});

const uploadStream = (fileName) => {
  const pass = new stream.PassThrough();

  const params = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: pass,
    ACL: 'public-read',
    ContentType: 'image/jpg',
  };

  s3.upload(params, function (err, data) {
    if (err) {
      console.log(`File uploaded error. ${err}`);
      throw err;
    }
    console.log(`File uploaded successfully. ${data}`);
  });

  return pass;
};

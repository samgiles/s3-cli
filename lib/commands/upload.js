const s3 = require('../index');
const fs = require('fs');
const path = require('path');

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

module.exports.command = 'upload <file> <destination>';
module.exports.describe = 'Upload a file to an S3 bucket';

module.exports.builder = {};

module.exports.handler = function(argv) {
  const s3Resource = s3.parseS3Resource(argv.destination);

  if (!(s3Resource.key && s3Resource.key.length)) {
    s3Resource.key = path.basename(argv.file);
  }

  const inputStream = fs.createReadStream(argv.file);

  s3.uploadFile(s3Resource.region, {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  }, s3Resource.bucket, s3Resource.key, inputStream);
};

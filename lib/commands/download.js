const s3 = require('../index');
const fs = require('fs');
const path = require('path');

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

module.exports.command = 'download <file> <output>';
module.exports.describe = 'Download a <file> from S3 - the file is specified using the following scheme: <region>/<bucket>/<key>.  <output> is the location on the file system to save the download file to.';

module.exports.builder = {};

module.exports.handler = function(argv) {
  const s3Resource = s3.parseS3Resource(argv.file);

  const outputLocation = getOutputFile(argv.output, s3Resource.key);

  outputLocation.then((outputFile) => {
    const outputStream = fs.createWriteStream(outputFile);

    s3.downloadFile(s3Resource.region, {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    }, s3Resource.bucket, s3Resource.key, outputStream)
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

};

// Given a CLI argument for a file location to save, this returns a writable
// file.  The CLI argument could be an open ended directory such as './',
// in this case, the natural thing to do is save the file with the key name at
// the directory location.  This file handles this logic.
function getOutputFile(cliArg, keyName) {
  return new Promise(function(resolve, reject) {
    fs.stat(cliArg, function(err, stats) {
      if (err) {
        reject(err);
      } else {
        resolve(stats);
      }
    });
  })
  .then((stats) => {
    if (stats.isDirectory()) {
      return path.join(cliArg, keyName);
    } else {
      return cliArg;
    }
  });
}

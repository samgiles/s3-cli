/**
* Copyright 2017 Samuel Giles
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:

* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.

* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/
const aws = require('aws-sdk');

function createS3Client(region, credentials) {
  return new aws.S3({
    // Required for connecting to most S3 regions now.
    // (https://docs.aws.amazon.com/AmazonS3/latest/API/sig-v4-authenticating-requests.html)
    signatureVersion: 'v4',
    accessKeyId: credentials.accessKeyId,
    secretAccessKey: credentials.secretAccessKey,
    endpoint: `https://s3.${region}.amazonaws.com`,
  });
}

function getObject(s3Client, bucket, key) {
  return new Promise((resolve, reject) => {
    s3Client.getObject({
      Bucket: bucket,
      Key: key,
    }, (err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });
}

function putObject(s3Client, bucket, key, inputStream) {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: bucket,
      Key: key,
      Body: inputStream,
    };

    console.log('putting object: ', inputStream);

    s3Client.upload(params, function(err, data) {
      console.log('object put');
      if (err) {
        return reject(err);
      }

      return resolve(data);
    });
  });
}

function downloadFile(region, credentials, bucket, key, outputStream) {
  const s3Client = createS3Client(region, credentials);

  getObject(s3Client, bucket, key)
    .then((result) => {
      outputStream.write(result.Body);
      try {
        outputStream.close();
      } catch (e) {
        // Ignore, some streams cannot be closed
      }
    })
    .catch((e) => {
      outputStream.emit('error', e);
    });
}

function uploadFile(region, credentials, bucket, key, inputStream) {
  const s3Client = createS3Client(region, credentials);
  return putObject(s3Client, bucket, key, inputStream);
}

function parseS3Resource(file) {
  const [region, bucket, key] = file.split('/');

  return {
    region,
    bucket,
    key,
  };
}

module.exports = {
  downloadFile,
  uploadFile,
  parseS3Resource,
};

# Simple S3 Command line client

## Usage

Requires authentication if necessary by setting up a `AWS_ACCESS_KEY_ID`
environment variable, and an `AWS_SECRET_ACCESS_KEY` environment variable.

### Upload

```
s3 upload ./myfile.png eu-west-2/my-bucket
```

### Download

```
s3 download eu-west-2/my-bucket/myfile.png ./
```

#### Extra

Each command follows a convention: `s3 <command> <source> <destination>`. Where
either the source or destination is a resource resident on S3, it uses a file
like scheme to define the resource:

```
<region>/<bucket>/<key>
```

In the case of uploading, the key is optional.  If the key is missing, then the
key will be the name of the file to upload.

##### Examples

```
s3 upload ./myfile.png eu-west-2/my-bucket
```

Will add the file `myfile.png` to `my-bucket` and the key will be named
`myfile.png`.


```
s3 upload ./myfile.png eu-west-2/my-bucket/newfile.png
```

Will add the file `myfile.png` to `my-bucket`, but the key will be named
`newfile.png`.


# Library

This can be used programatically and the library exports the following methods:

`downloadFile(region, { accessKeyId, secretAccessKey }, bucket, key, writeStream)`

`uploadFile(region, { accessKeyId, secretAccessKey }, bucket, key, inputStream)`


# License

MIT

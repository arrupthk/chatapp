const AWS = require('aws-sdk')

function uploadToS3(file) {
    return new Promise((resolve, reject) => {
      const BUCKET_NAME = process.env.BUCKET_NAME;
      const IAM_USER_KEY = process.env.IAM_USER_KEY;
      const IAM_USER_SECRET = process.env.IAM_USER_SECRET;
  
      let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET
      });
  
      s3bucket.createBucket(() => {
        var params = {
          Bucket: BUCKET_NAME,
          Key: file.originalname,
          Body: file,
          ACL: 'public-read'
        };
  
        s3bucket.upload(params, (err, s3response) => {
          if (err) {
            console.log("Something went wrong", err);
            reject(err);
          } else {
            console.log('Success', s3response);
            resolve(s3response.Location);
          }
        });
      });
    });
  }


  module.exports= { uploadToS3}
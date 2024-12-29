require("dotenv").config();
const path = require('path');
const fs = require('fs');
const {sync: globSync} = require('glob');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const cloudfront = new AWS.CloudFront();
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});
const getContentType = (filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
        case '.html':
            return 'text/html';
        case '.json':
            return 'application/json';
        case '.png':
            return 'image/png';
        case '.css':
            return 'text/css';
        case '.js':
            return 'application/javascript';
        default:
            return 'application/octet-stream';
    }
};
const paths = globSync(".server.js");
paths.map((filePath, index, arr) => {
    const fileContent = fs.readFileSync(filePath);
    const contentType = getContentType(filePath);
    s3.upload({
        Bucket: 'dbdbdbdbdbgroup.com',
        Key: 'demo',
        Body: fileContent,
        ContentType: contentType,
    }, (err, data) => {
        if (err) return console.error('Error uploading file:', err);
        console.log(`File uploaded successfully at ${data.Location}`);
        if(index >= arr.length - 1) {
            cloudfront.createInvalidation({
                DistributionId: "E3IXY2ACIKURY1",
                InvalidationBatch: {
                    CallerReference: `${Date.now().toString()}`,
                    Paths: {
                        Quantity: paths.length,
                        Items: paths.map(path => path.replace(".s3", "")),
                    },
                },
            }, (err, data) => {
                if (err) {
                    console.error("Error creating CloudFront invalidation:", err, paths);
                    return;
                }
                console.log("Invalidation created successfully:", data.Invalidation.Id, paths);
            });
        }
    });
    return filePath.replace('.s3\\', '/');
});
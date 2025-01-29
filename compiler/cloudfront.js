require("dotenv").config();
const AWS = require('aws-sdk');
const cloudFront = new AWS.CloudFront();
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});
cloudFront.createInvalidation({
    DistributionId: process.env.AWS_DISTRIBUTION_ID,
    InvalidationBatch: {
        CallerReference: `invalidate-${Date.now()}`,
        Paths: {
            Quantity: 1,
            Items: ['/*'],
        },
    },
}).promise().then(result => {
    console.log('cloudfront :: invalidation started');
}).catch(err => {
    console.log('cloudfront :: invalidation error', err);
});
require("dotenv").config();
const AWS = require('aws-sdk');
const value = process.argv[2] || 'test';
(async () => {
    try {
        AWS.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION,
        });
        const route53 = new AWS.Route53({region: process.env.AWS_REGION});
        const params = {
            HostedZoneId: process.env.AWS_HOSTED_ZONE_ID,
            ChangeBatch: {
                Changes: [
                    {
                        Action: 'UPSERT',
                        ResourceRecordSet: {
                            Name: 'dbdbdbdbdbgroup.com.',
                            Type: 'TXT',
                            TTL: 300,
                            ResourceRecords: [
                                {
                                    Value: `"${value}"`
                                }
                            ]
                        }
                    }
                ]
            }
        };
        const response = await route53.changeResourceRecordSets(params).promise();
        console.log('TXT record added successfully:', response);
    } catch (error) {
        console.error('Error adding TXT record:', error);
    }
})();

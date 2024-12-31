const AWS = require('aws-sdk');
const acme = require('acme-client');
const fs = require('fs');
try {
    (async () => {
        const domain = 'api.dbdbdbdbdb.com';
        const bucketName = 'www.dbdbdbdbdb.com';
        const challengeFolder = '.well-known/acme-challenge/';
        const s3 = new AWS.S3();
        AWS.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION,
        });
        const accountKey = await acme.forge.createPrivateKey(2048); // Explicitly create an RSA key
        const acmeClient = new acme.Client({
            directoryUrl: acme.directory.letsencrypt.production,
            accountKey,
        });
        await acmeClient.createAccount({
            termsOfServiceAgreed: true,
            contact: ['mailto:info+streamdream@newmediapilot.com'],
        });
        const [keyAuthorization, token] = await acmeClient.getChallenge(domain, 'http-01');
        const challengePath = `${challengeFolder}${token}`;
        await s3.putObject({
            Bucket: bucketName,
            Key: challengePath,
            Body: keyAuthorization,
            ContentType: 'text/plain',
        }).promise();
        await acmeClient.completeChallenge({keyAuthorization, token});
        await acmeClient.waitForValidStatus();
        const [cert, key] = await acmeClient.createCertificate(domain);
        fs.writeFileSync('cert.pem', cert);
        fs.writeFileSync('key.pem', key);
    })();
} catch (error) {
    console.log('cert :: error', error);
}

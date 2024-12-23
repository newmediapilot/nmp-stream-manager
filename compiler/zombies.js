require("dotenv").config();
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const AWS = require('aws-sdk');
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});
const s3 = new AWS.S3();
const cloudfront = new AWS.CloudFront();
const getContentType = (filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
        case '.html': return 'text/html';
        case '.json': return 'application/json';
        case '.png': return 'image/png';
        case '.jpg':
        case '.jpeg': return 'image/jpeg';
        case '.css': return 'text/css';
        case '.js': return 'application/javascript';
        default: return 'application/octet-stream';
    }
};
const htmlString = fs.readFileSync('./src/templates/zombie.html', { encoding: 'utf-8' });
const manifestJson = fs.readFileSync('./src/client/manifest.json', { encoding: 'utf-8' });
fs.existsSync('.s3') && fs.rmdirSync('.s3', { recursive: true });
fs.mkdirSync('.s3');
fs.cpSync('./src/client/icon512_maskable.png', './.s3/icon512_maskable.png');
fs.cpSync('./src/client/icon512_rounded.png', './.s3/icon512_rounded.png');
[22].forEach((a, index) => {
    const json = JSON.parse(String(manifestJson));
    json.start_url = `.s3/${index + 22}.html`;
    const html = htmlString.replace(`href="/manifest.json"`, `href="/${index + 22}.json">`);
    fs.writeFileSync(`.s3/${index + 22}.html`, html, { encoding: 'utf-8' });
    fs.writeFileSync(`.s3/${index + 22}.json`, JSON.stringify(json), { encoding: 'utf-8' });
});
const paths = glob.globSync(".s3/**/*.*").map((filePath, index, arr) => {
    const bucket = 'dbdbdbdbdbgroup.com';
    const fileContent = fs.readFileSync(filePath);
    const contentType = getContentType(filePath);
    s3.upload({
        Bucket: bucket,
        Key: filePath.replace('.s3\\', ''),
        Body: fileContent,
        ContentType: contentType,
    }, (err, data) => {
        if (err) return console.error('Error uploading file:', err);
        console.log(`File uploaded successfully at ${data.Location}`);
        if (index >= arr.length - 1) {
            cloudfront.createInvalidation({
                DistributionId: "E3IXY2ACIKURY1",
                InvalidationBatch: {
                    CallerReference: `${Date.now().toString()}`,
                    Paths: {
                        Quantity: paths.length,
                        Items: paths,
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
    return filePath.replace('.s3\\', '/'); // Return S3 path format
});

require("dotenv").config();
const path = require('path');
const fs = require('fs');
const {sync: globSync} = require('glob');
const AWS = require('aws-sdk');
const hash = process.argv.pop() || 'demo';
const s3 = new AWS.S3();

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

const s3upload = (s3path, fileContents) => {
    console.log(`s3upload :: file uploading ${s3path}`);
    s3.upload({
        Bucket: 'dbdbdbdbdbgroup.com',
        Key: s3path,
        Body: fileContents,
        ContentType: getContentType(s3path),
    }, (err, data) => {
        if (err) return console.error('s3upload :: error uploading file:', err);
        console.log(`s3upload :: file uploaded successfully at ${data.Location}`);
    });
};

[
    ...globSync(".tplt-*.html"),
].map((filePath) => s3upload(`${hash}/${path.basename(filePath).replace('.tplt-', '')}`, fs.readFileSync(filePath)));

[
    ...globSync(".server.js"),
    ...globSync(".package/StreamDream.exe"),
    ...globSync("manifest.json"),
].map((filePath) => s3upload(`${hash}/${path.basename(filePath)}`, fs.readFileSync(filePath)));

[
    ...globSync("src/client/icon512_maskable.ico"),
    ...globSync("src/client/icon512_maskable.png"),
    ...globSync("src/client/icon512_rounded.ico"),
    ...globSync("src/client/icon512_rounded.png"),
].map((filePath) =>
    s3upload(`${path.basename(filePath)}`, fs.readFileSync(filePath))
);
require("dotenv").config();
const fs = require('fs');
const AWS = require('aws-sdk');
const ec2 = new AWS.EC2();
const hashes = process.argv.slice(2).length ? process.argv.slice(2) : ["demo"];
try {
    (async () => {
        console.log('ec2 :: generate proxy');
        const proxy = fs
            .readFileSync('./src/proxy/proxy.js', {encoding: 'utf-8'})
            .split('\r\n')
            .map(line => line.replace('${fs.readFileSync(\'.cert/cert.crt\', {encoding: "utf-8"})}', `${fs.readFileSync('.cert/cert.crt', {encoding: 'utf-8'})}`))
            .map(line => line.replace('${fs.readFileSync(\'.cert/cert.key\', {encoding: "utf-8"})}', `${fs.readFileSync('.cert/cert.key', {encoding: 'utf-8'})}`))
            .map(line => line.replace(`'hashes'`, `${hashes.map(h=>`'${h}'`).join(',')}`))
            .join('\r\n');
        console.log('ec2 :: generate startup');
        const startup = fs
            .readFileSync('./src/proxy/startup.sh', {encoding: 'utf-8'})
            .split('\r\n')
            .map(line => line.replace('/** proxy.js **/', `${proxy}`))
            .join('\r\n');
        fs.writeFileSync('.startup.sh', startup, {encoding: 'utf-8'});
        console.log('ec2 :: begin with', process.env.AWS_INSTANCE_ID);
        AWS.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION,
        });
        console.log('ec2 :: stopping', process.env.AWS_INSTANCE_ID);
        await ec2.stopInstances({InstanceIds: [process.env.AWS_INSTANCE_ID]}).promise();
        await ec2.waitFor('instanceStopped', {InstanceIds: [process.env.AWS_INSTANCE_ID]}).promise();
        await ec2.modifyInstanceAttribute({
            InstanceId: process.env.AWS_INSTANCE_ID,
            UserData: {
                Value: startup,
            },
        }).promise();
        console.log('ec2 :: starting', process.env.AWS_INSTANCE_ID);
        await ec2.startInstances({InstanceIds: [process.env.AWS_INSTANCE_ID]}).promise();
        await ec2.waitFor('instanceRunning', {InstanceIds: [process.env.AWS_INSTANCE_ID]}).promise();
        console.log('ec2 :: started', process.env.AWS_INSTANCE_ID);
    })();
} catch (error) {
    console.log('ec2 :: error', error);
}


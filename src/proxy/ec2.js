const fs = require('fs');
const proxy = fs.readFileSync('./src/proxy/proxy.js', {encoding: 'utf-8'})
    .split('\r\n')
    .map(line => line.replace('cert-xxx', `${fs.readFileSync('.cert/cert.crt', {encoding: 'utf-8'})}`))
    .map(line => line.replace('key-xxx', `${fs.readFileSync('.cert/cert.key', {encoding: 'utf-8'})}`))
    .join('\r\n');
const startup = fs.readFileSync('./src/proxy/startup.sh', {encoding: 'utf-8'})
    .split('\r\n')
    .map(line => line.replace('/** proxy.js **/', `${proxy}`))
    .join('\r\n');
fs.writeFileSync('.startup.sh', startup, {encoding: 'utf-8'});
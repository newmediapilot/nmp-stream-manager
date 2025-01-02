const fs = require('fs');
const startup = fs.readFileSync('./src/proxy/startup.sh', {encoding: 'utf-8'});
const lines = startup.split('\r\n')
    .map(line => line.replace('cert-xxx', `"${fs.readFileSync('.cert/cert.crt', {encoding: 'utf-8'})}"`))
    .map(line => line.replace('key-xxx', `"${fs.readFileSync('.cert/cert.key', {encoding: 'utf-8'})}"`))
    .join('\r\n');
fs.writeFileSync('.startup.sh', lines, {encoding: 'utf-8'});
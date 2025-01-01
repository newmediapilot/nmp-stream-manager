const fs = require('fs');
const startup = fs.readFileSync('./src/proxy/startup.sh', {encoding: 'utf-8'});
// Modify
fs.writeFileSync('.startup.sh', startup, {encoding: 'utf-8'});
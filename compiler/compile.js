const fs = require('fs');
const {sync:globSync} = require('glob');
fs.existsSync('./.src') && fs.rmdirSync('./.src');
globSync('./src/**/*.*').map(path => {
    const dir = '';
    console.log('path',path);
});
// fs.copyFileSync('./src', './.src');
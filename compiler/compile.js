const fs = require('fs');
const {execSync} = require('child_process');
const {sync: globSync} = require('glob');
execSync('rm -rf ./.src');
globSync('./src/**/*.*')
    .map(path => path.replace('./src/', './.src/'))
    .map(path => path.split('/').slice(0, -1).join('/'))
    .sort((a, b) => a.length - b.length)
    .map(dir => !fs.existsSync(dir) && fs.mkdirSync(dir));
globSync('./src/**/*.*')
    .map(path => {
        fs.copyFileSync(path, path.replace('./src/', './.src/'));
        return path.replace('./src/', './.src/');
    })
    .map(path => {
        if(path.endsWith('.js') && path.includes('/server')) {
            const fileContents = fs.readFileSync(path);
            console.log('path', path);
        }
    });
const fs = require('fs');
const {sync: globSync} = require('glob');

const server = globSync('./src/**/*.*')
    .sort((a, b) => a.localeCompare(b))
    .filter(path => path.startsWith('./src/server/'))
    .map(path => fs.readFileSync(path))
    .join('\r\n');

const lines = server.split('\r\n')
    .sort((a, b) => {
        if (a.startsWith("module.exports") && !b.startsWith("module.exports")) return -1;
        if (!a.startsWith("module.exports") && b.startsWith("module.exports")) return 1;
        return 0;
    })
    .sort((a, b) => {
        if (a.includes(`require("`)) return -1;
        if (!a.includes(`require("`)) return 1;
        return 0;
    })
    .sort((a, b) => {
        if (a.includes(`require("./`)) return -1;
        if (!a.includes(`require("./`)) return 1;
        return 0;
    });

fs.writeFileSync('./.server.js', lines.join('\r\n'), {encoding: 'utf-8'});

console.log('lines', lines.slice(0,120));
console.log('server', server.length);
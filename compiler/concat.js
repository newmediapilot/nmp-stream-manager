const fs = require('fs');
const {sync: globSync} = require('glob');
const server = globSync('./src/server/**/*.js')
    .map(path => {
        console.log('concat :: path', path);
        return path;
    })
    .map(path => {
        const contents = fs.readFileSync(path, {encoding: "utf-8"});
        return {
            path,
            contents,
        }
    })
    .map(({path, contents}) => {
        if (path.startsWith('./src/server')) {
            return {contents: contents, path};
        } else {
            return {contents, path};
        }
    })
    .map(({contents}) => contents)
    .join('');

fs.writeFileSync('./.server.js', server, {encoding: 'utf-8'});
console.log('concat :: path', server.substr(0, 400));
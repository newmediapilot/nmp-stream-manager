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
        return {
            contents: (() => {
                if (path.endsWith('index.js')) return contents;
                let contentLines = contents.trim().split('\r\n');
                const constBarrel = contentLines[contentLines.length - 1]
                    .split('=')[1]
                    .replace(';', '');
                const barrelKeys = constBarrel
                    .replace('{', '')
                    .replace('}', '')
                    .split(',')
                    .map(key => key.trim())
                    .map(key => `${key}:_${key}`)
                    .join(',');
                contentLines = [
                    ...[`const {${barrelKeys}} = (() => {`],
                    ...contentLines.map(line => line.replace('module.exports =', 'return')),
                    ...[`})();`],
                ];
                return contentLines.join('\r\n');
            })(),
            path,
        };
    })
    .map(({contents}) => contents)
    .join('');
fs.writeFileSync('./.server.js', server, {encoding: 'utf-8'});
console.log('concat :: path', server.substr(0, 400));
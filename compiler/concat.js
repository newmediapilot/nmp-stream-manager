const fs = require('fs');
const {sync: globSync} = require('glob');
const server = globSync('./src/server/**/*.js')
    .map(path => {
        console.log('concat :: path', path);
        return path;
    })
    .map(path => {
        const content = fs.readFileSync(path, {encoding: "utf-8"});
        return {
            path,
            content,
        }
    })
    .map(({path, content}) => {
        return {
            content: (() => {
                if (path.endsWith('index.js')) return content;
                let contentLines = content.trim().split('\r\n');
                const constBarrel = contentLines[contentLines.length - 1]
                    .split('=')[1]
                    .replace(';', '');
                const barrelKeys = constBarrel
                    .replace('{', '')
                    .replace('}', '')
                    .split(',')
                    .map(key => key.trim())
                    .map(key => `${key}:_${key}`)
                const barrelOutput = (barrelKeys.length > 1) ? barrelKeys.join(',') : barrelKeys[0];
                console.log('barrelOutput', barrelOutput);
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
    .map(({path, content}) => {
        return {
            content: (() => {
                if (!path.endsWith('index.js')) return content;
                let contentLines = content.trim().split('\r\n');
                contentLines = [
                    ...[`(() => {`],
                    ...contentLines,
                    ...[`})();`],
                ];
                return {
                    content: contentLines.join('\r\n'),
                    path,
                }
            })(),
            path,
        };
    })
    .map(({content}) => content)
    .join('\r\n');
fs.writeFileSync('./.server.js', server, {encoding: 'utf-8'});
console.log('concat :: path', server.substr(0, 400));
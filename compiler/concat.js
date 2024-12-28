const fs = require('fs');
const {sync: globSync} = require('glob');
const server = globSync('./src/server/**/*.js')
    .map(path => {
        console.log('concat :: path', path);
        return path;
    })
    .map(path => {
        const content = fs.readFileSync(path, {encoding: "utf-8"});
        console.log('concat :: read', path);
        return {
            path,
            content,
        }
    })
    .map(({path, content}) => {
        console.log('concat :: modularize', path);
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
                    .map(key => `${key}:_${key}`);
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
        console.log('concat :: connect', path);
        return {
            content: (() => {
                let contentLines = content.trim().split('\r\n');
                let outputLines = contentLines.map(line => {
                    if (
                        line.includes('require(".') ||
                        line.includes("require('.")) {
                        let key = line.trim()
                            .split('=')[0]
                            .replace('const', '')
                            .replace('{', '')
                            .replace('}', '')
                            .replace(' ', '')
                            .trim();
                        if (key.includes(',')) {
                            return `const [${key}] = [${key.split(',').map(k => `_${k.trim()}`)}];`;
                        } else {
                            return `const [${key}] = [_${key}];`;
                        }
                    } else {
                        return line;
                    }
                });
                contentLines = [
                    ...outputLines,
                ];
                return contentLines.join('\r\n')
            })(),
            path,
        };
    })
    .map(({path, content}) => {
        return {
            content: (() => {
                if (!path.endsWith('index.js')) return content;
                console.log('concat :: index', path);
                let contentLines = content.trim().split('\r\n');
                return `(()=>{${contentLines.join('\r\n')}})()`;
            })(),
            path,
        };
    });
const index = server.splice(server.indexOf(server.find(({path}) => path.endsWith('index.js'))), 1);
const output = [
    ...server.splice(server.indexOf(server.find(({path}) => path.endsWith('manager.js'))), 1),
    ...server.splice(server.indexOf(server.find(({path}) => path.endsWith('message.js'))), 1),
    ...server.splice(server.indexOf(server.find(({path}) => path.endsWith('marker.js'))), 1),
    ...server.splice(server.indexOf(server.find(({path}) => path.endsWith('broadcast.js'))), 1),
    ...server.splice(server.indexOf(server.find(({path}) => path.endsWith('tweet.js'))), 1),
    ...server.splice(server.indexOf(server.find(({path}) => path.endsWith('clip.js'))), 1),
    ...server.splice(server.indexOf(server.find(({path}) => path.endsWith('twip.js'))), 1),
    ...server.splice(server.indexOf(server.find(({path}) => path.endsWith('ads.js'))), 1),
    ...server,
    ...index,
]
    .map(({content, path}) => `/** start :: ${path} */\r\n${content}\r\n/** end :: ${path} */`)
    .join('\r\n');

fs.writeFileSync(
    './.server.js',
    output,
    {encoding: 'utf-8'}
);
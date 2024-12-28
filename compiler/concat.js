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
                    if (line.includes('require(".')) {
                        // const {getParam, setSecret} = require('../store/manager');
                        // const {getParam, setSecret} = {getParam:_getParam, setSecret:_setSecret};
                        const key = line.trim()
                            .split('=')[0]
                            .replace('const', '')
                            .replace('{', '')
                            .replace('}', '')
                            .replace(' ', '')
                            .trim();
                        return `const {${key}} = {_${key}};`;
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
    .sort(({path: a}, {path: b}) => {
        const aIsIndex = a.endsWith('index.js') ? -1 : 0;
        const bIsIndex = b.endsWith('index.js') ? -1 : 0;
        return bIsIndex - aIsIndex;
    })
    .sort(({path: a}, {path: b}) => {
        const aIsIndex = a.endsWith('manager.js') ? -1 : 0;
        const bIsIndex = b.endsWith('manager.js') ? -1 : 0;
        return aIsIndex -bIsIndex;
    })
    .sort(({path: a}, {path: b}) => {
        const aIsIndex = a.endsWith('manager.js') ? -1 : 0;
        const bIsIndex = b.endsWith('manager.js') ? -1 : 0;
        return aIsIndex -bIsIndex;
    })
    .map(({content}) => content)
    .join('\r\n');
fs.writeFileSync('./.server.js', server, {encoding: 'utf-8'});
// console.log('concat :: path', server.substr(0, 400));
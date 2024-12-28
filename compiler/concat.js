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
    })
    .map(({content,path}) => `/** ${path} */${content}`)
    .join('\r\n');

fs.writeFileSync('./.server.js', server, {encoding: 'utf-8'});
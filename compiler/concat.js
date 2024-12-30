const fs = require('fs');
const {sync: globSync} = require('glob');
const request = require('sync-request');
const hash = process.argv[2] || 'demo';
const server = globSync('./src/server/**/*.*')
    .map(filePath => {
        console.log('server :: filePath', filePath);
        return filePath;
    })
    .map(filePath => {
        const content = fs.readFileSync(filePath, {encoding: "utf-8"});
        console.log('server :: read', filePath);
        return {
            filePath,
            content,
        }
    })
    .map(({filePath, content}) => {
        console.log('server :: modularize', filePath);
        return {
            content: (() => {
                if (filePath.endsWith('index.js')) return content;
                let contentLines = content.trim().split('\r\n');
                let exportLine = contentLines[contentLines.length - 1];
                const constBarrel = exportLine
                    .split('=')[1]
                    .replace(';', '');
                console.log('server :: modularize :: constBarrel', constBarrel);
                const barrelKeys = constBarrel
                    .replace('{', '')
                    .replace('}', '')
                    .split(',')
                    .map(key => key.trim())
                    .map(key => `${key}:_${key}`);
                console.log('server :: modularize :: barrelKeys', barrelKeys);
                contentLines = [
                    ...[`const {${barrelKeys}} = (() => {`],
                    ...contentLines.map(line => line
                        .replace('module.exports =', 'return')
                        .replace(`https://dbdbdbdbdbgroup.com/demo/.server.js`, `"https://dbdbdbdbdbgroup.com/${hash}/.server.js"`)
                        .replace('process.env.TWITCH_CLIENT_ID', '"process.env.TWITCH_CLIENT_ID"')
                        .replace('process.env.TWITCH_CLIENT_SECRET', '"process.env.TWITCH_CLIENT_SECRET"')
                        .replace('process.env.TWITCH_USERNAME', '"process.env.TWITCH_USERNAME"')
                        .replace('process.env.TWITCH_SCOPES', '"process.env.TWITCH_SCOPES"')
                        .replace('process.env.TWITTER_API_KEY', '"process.env.TWITTER_API_KEY"')
                        .replace('process.env.TWITTER_API_SECRET', '"process.env.TWITTER_API_SECRET"')
                        .replace('process.env.TWITTER_ACCESS_TOKEN', '"process.env.TWITTER_ACCESS_TOKEN"')
                        .replace('process.env.TWITTER_ACCESS_SECRET', '"process.env.TWITTER_ACCESS_SECRET"')
                    ),
                    ...[`})();`],
                ];
                return contentLines.join('\r\n');
            })(),
            filePath,
        };
    })
    .map(({filePath, content}) => {
        console.log('server :: connect', filePath);
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
            filePath,
        };
    })
    .map(({filePath, content}) => {
        return {
            content: (() => {
                if (!filePath.endsWith('index.js')) return content;
                console.log('server :: index', filePath);
                let contentLines = content.trim().split('\r\n');
                return `(()=>{${contentLines.join('\r\n')}})()`;
            })(),
            filePath,
        };
    });

const launch = globSync('./src/launch.js')
    .map(filePath => {
        console.log('launch :: filePath', filePath);
        return filePath;
    })
    .map(filePath => {
        const content = fs.readFileSync(filePath, {encoding: "utf-8"});
        console.log('launch :: read', filePath);
        return {
            filePath,
            content,
        }
    })
    .map(({filePath, content}) => {
        console.log('launch :: modularize', filePath);
        return {
            content: (() => {
                let contentLines = content.trim().split('\r\n');
                contentLines = [
                    ...contentLines.map(line => line
                        .replace(`https://dbdbdbdbdbgroup.com/demo/.server.js`, `https://dbdbdbdbdbgroup.com/${hash}/.server.js`)
                    ),
                ];
                return contentLines.join('\r\n');
            })(),
            filePath,
        };
    })
    .map(({content, filePath}) => {
        console.log('launch :: filePath', filePath);
        return content;
    })
    .join('\r\n');

fs.writeFileSync(
    '.launch.js',
    launch,
    {encoding: 'utf-8'}
);

const routes = server.splice(server.indexOf(server.find(({filePath}) => filePath.endsWith('routes.js'))), 1);
const manager = server.splice(server.indexOf(server.find(({filePath}) => filePath.endsWith('manager.js'))), 1);
const message = server.splice(server.indexOf(server.find(({filePath}) => filePath.endsWith('message.js'))), 1);
const ads = server.splice(server.indexOf(server.find(({filePath}) => filePath.endsWith('ads.js'))), 1);
const broadcast = server.splice(server.indexOf(server.find(({filePath}) => filePath.endsWith('broadcast.js'))), 1);
const clip = server.splice(server.indexOf(server.find(({filePath}) => filePath.endsWith('clip.js'))), 1);
const tweet = server.splice(server.indexOf(server.find(({filePath}) => filePath.endsWith('tweet.js'))), 1);
const marker = server.splice(server.indexOf(server.find(({filePath}) => filePath.endsWith('marker.js'))), 1);
const twip = server.splice(server.indexOf(server.find(({filePath}) => filePath.endsWith('twip.js'))), 1);
const commands = server.splice(server.indexOf(server.find(({filePath}) => filePath.endsWith('commands.js'))), 1);
const stream = server.splice(server.indexOf(server.find(({filePath}) => filePath.endsWith('stream.js'))), 1);
const index = server.splice(server.indexOf(server.find(({filePath}) => filePath.endsWith('index.js'))), 1);

let output = [
    ...routes,
    ...manager,
    ...message,
    ...ads,
    ...broadcast,
    ...marker,
    ...clip,
    ...tweet,
    ...twip,
    ...commands,
    ...stream,
    ...server,
    ...index,
]
    .map(({content, filePath}) => {
        console.log('output :: filePath', filePath);
        return ({content, filePath});
    })
    .map(({content, filePath}) => `/** start :: ${filePath} */\r\n${content}\r\n/** end :: ${filePath} */`)
    .join('\r\n');

const templates = globSync('./src/templates/**/*.*')
    .map(filePath => {
        console.log('templates :: filePath', filePath);
        return filePath;
    })
    .map(filePath => {
        const content = fs.readFileSync(filePath, {encoding: "utf-8"});
        console.log('templates :: read', filePath);
        return {
            filePath,
            content,
        }
    }).map(({filePath, content}) => {
        console.log('templates :: inline', filePath);
        return {
            content: (() => {
                let contentLines = content.trim().split('\r\n');
                const outputLines = contentLines.map(line => {
                    if (line.includes('<script src="../')) {
                        const src = line.split('<script src="../')[1].split('?"')[0];
                        return `<script type="text/javascript">${fs.readFileSync(`./src/${src}`, {encoding: "utf-8"})}</script>`;
                    }
                    if (line.includes('<link href="../')) {
                        const src = line.split('<link href="../')[1].split('?"')[0];
                        return `<style>${fs.readFileSync(`./src/${src}`, {encoding: "utf-8"})}</style>`;
                    }
                    if (line.includes('<script src="https://')) {
                        const cdn = line.split('<script src="')[1].split('?"')[0];
                        const res = request('GET', cdn);
                        return `<script type="text/javascript">${res.getBody('utf-8')}</script>`;
                    }
                    return line;
                });
                return [
                    ...outputLines,
                ].join('\r\n')
            })(),
            filePath,
        };
    });

templates.forEach(({filePath, content}) => {
    console.log('templates :: inject', filePath);
    output = output.replace(
        `fs.readFileSync('${filePath}', {encoding: 'utf-8'})`,
        `Buffer.from('${Buffer.from(content).toString('base64')}', 'base64').toString('utf-8')`
    );
});
fs.writeFileSync(
    './.server.js',
    output,
    {encoding: 'utf-8'}
);
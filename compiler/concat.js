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
                        .replace(`/demo/`, `/${hash}/`)
                        .replace(`/api/signal/`, `https://api.dbdbdbdbdbgroup.com/${hash}/api/signal/`)
                        .replace(`/api/config/`, `https://api.dbdbdbdbdbgroup.com/${hash}/api/config/`)
                        .replace(`/api/media/`, `https://api.dbdbdbdbdbgroup.com/${hash}/api/media/`)
                        .replace(`/api/style/`, `https://api.dbdbdbdbdbgroup.com/${hash}/api/style/`)
                        .replace(`/demo/t/w/i/t/c/h/l/o/g/i/n/`, `https://api.dbdbdbdbdbgroup.com/${hash}/t/w/i/t/c/h/l/o/g/i/n/`)
                        .replace(`/demo/memory/signal/`, `/${hash}/memory/signal/`)
                        .replace(`/demo/memory/config/`, `/${hash}/memory/config/`)
                        .replace(`/demo/memory/media/`, `/${hash}/memory/media/`)
                        .replace(`/demo/memory/style/`, `/${hash}/memory/style/`)
                        .replace(`'/demo/socket.io'`, `'/${hash}/socket.io'`)
                        .replace(`path: '/demo/socket.io'`, `path: '/${hash}/socket.io'`)
                        .replace(`io = socketIo(server`, `io = socketIo("https://api.dbdbdbdbdbgroup.com/"`)
                        .replace('baseURL = ""', 'baseURL = "https://api.dbdbdbdbdbgroup.com"')
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
                        .replace(`/demo/`, `/${hash}/`)
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
const memory = server.splice(server.indexOf(server.find(({filePath}) => filePath.endsWith('memory.js'))), 1);
const socket = server.splice(server.indexOf(server.find(({filePath}) => filePath.endsWith('socket.js'))), 1);
let output = [
    ...routes,
    ...manager,
    ...memory,
    ...socket,
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
                        let src = line.split('<script src="../')[1].split('?"')[0];
                        let content = fs.readFileSync(`./src/${src}`, {encoding: "utf-8"});
                        content = content.split('\r\n')
                            .map(line => line.replace('io("https://localhost"', `io("https://api.dbdbdbdbdbgroup.com"`))
                            .map(line => line.replace('/demo/socket.io', `/${hash}/socket.io`))
                            .join('\r\n');
                        return `<script type="text/javascript">${content}</script>`;
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
                    line = line.replace(new RegExp('content="/demo/memory/signal/create', "gm"), `content="https://api.dbdbdbdbdbgroup.com/${hash}/memory/signal/create`);
                    line = line.replace(new RegExp('content="/demo/memory/config/update', "gm"), `content="https://api.dbdbdbdbdbgroup.com/${hash}/memory/config/update`);
                    line = line.replace(new RegExp('content="/demo/memory/style/update', "gm"), `content="https://api.dbdbdbdbdbgroup.com/${hash}/memory/style/update`);
                    line = line.replace(new RegExp('content="/demo/memory/media/update', "gm"), `content="https://api.dbdbdbdbdbgroup.com/${hash}/memory/media/update`);
                    line = line.replace(new RegExp('content="/demo/api/signal/create', "gm"), `content="https://api.dbdbdbdbdbgroup.com/${hash}/api/signal/create`);
                    line = line.replace(new RegExp('content="/demo/api/config/update', "gm"), `content="https://api.dbdbdbdbdbgroup.com/${hash}/api/config/update`);
                    line = line.replace(new RegExp('content="/demo/api/style/update', "gm"), `content="https://api.dbdbdbdbdbgroup.com/${hash}/api/style/update`);
                    line = line.replace(new RegExp('content="/demo/api/media/update', "gm"), `content="https://api.dbdbdbdbdbgroup.com/${hash}/api/media/update`);
                    line = line.replace(new RegExp('content="/demo/index.html', "gm"), `content="https://api.dbdbdbdbdbgroup.com/${hash}/index.html`);
                    line = line.replace(new RegExp('content="/demo/panel-dashboard.html', "gm"), `content="https://dbdbdbdbdbgroup.com/${hash}/panel-dashboard.html`);
                    line = line.replace(new RegExp('content="/demo/panel-actions.html', "gm"), `content="https://dbdbdbdbdbgroup.com/${hash}/panel-actions.html`);
                    line = line.replace(new RegExp('content="/demo/panel-layout.html', "gm"), `content="https://dbdbdbdbdbgroup.com/${hash}/panel-layout.html`);
                    line = line.replace(new RegExp('content="/demo/panel-draw.html', "gm"), `content="https://dbdbdbdbdbgroup.com/${hash}/panel-draw.html`);
                    line = line.replace(new RegExp('content="/demo/embed.html', "gm"), `content="https://dbdbdbdbdbgroup.com/${hash}/embed.html`);
                    line = line.replace(new RegExp('content="/demo/embed-feature.html', "gm"), `content="https://dbdbdbdbdbgroup.com/${hash}/embed-feature.html`);
                    line = line.replace(new RegExp('content="/demo/embed-media.html', "gm"), `content="https://dbdbdbdbdbgroup.com/${hash}/embed-media.html`);
                    line = line.replace(new RegExp('content="/demo/embed-draw.html', "gm"), `content="https://dbdbdbdbdbgroup.com/${hash}/embed-draw.html`);
                    line = line.replace(new RegExp('content="/demo/embed-sound.html', "gm"), `content="https://dbdbdbdbdbgroup.com/${hash}/embed-sound.html`);
                    line = line.replace(new RegExp('content="/demo/t/w/i/t/c/h/l/o/g/i/n/', "gm"), `content="https://api.dbdbdbdbdbgroup.com/${hash}/t/w/i/t/c/h/l/o/g/i/n/`);
                    line = line.replace(new RegExp('content="/t/w/i/t/c/h/l/o/g/i/n/s/u/c/c/e/s/s/', "gm"), `content="https://api.dbdbdbdbdbgroup.com/t/w/i/t/c/h/l/o/g/i/n/s/u/c/c/e/s/s/`);
                    line = line.replace(new RegExp('data-url="https://localhost{{public_routes.INDEX}}"', "gm"), `data-url="https://dbdbdbdbdbgroup.com/${hash}/index.html"`);
                    line = line.replace(new RegExp('data-url="https://localhost{{public_routes.PANEL_EMBED}}"', "gm"), `data-url="https://dbdbdbdbdbgroup.com/${hash}/embed.html"`);
                    line = line.replace(new RegExp('https://api.dbdbdbdbdbgroup.com/demo/', "gm"), `https://api.dbdbdbdbdbgroup.com/${hash}/`);
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
const fs = require('fs');
const {sync: globSync} = require('glob');
const templates = globSync('./src/templates/**/*.*')
    .map(path => {
        console.log('templates :: path', path);
        return path;
    })
    .map(path => {
        const content = fs.readFileSync(path, {encoding: "utf-8"});
        console.log('templates :: read', path);
        return {
            path,
            content,
        }
    }).map(({path, content}) => {
        console.log('templates :: inline', path);
        return {
            content: (() => {
                let contentLines = content.trim().split('\r\n');
                const outputLines = contentLines.map(line => {
                    if (line.includes('<script src="../')) {
                        const src = line.split('<script src="../')[1].split('')
                    }
                    if (line.includes('<script src="../')) {
                        const href = line.split('<script src="../')[1]
                    }
                    if (line.includes('<link href="../')) {
                        const href = line.split('<script src="../')[1]
                    }
                    return line;
                });
                return [
                    ...outputLines,
                ].join('\r\n')
            })(),
            path,
        };
    });
console.log('templates', templates.length);
process.exit(0);
const server = globSync('./src/server/**/*.*')
    .map(path => {
        console.log('server :: path', path);
        return path;
    })
    .map(path => {
        const content = fs.readFileSync(path, {encoding: "utf-8"});
        console.log('server :: read', path);
        return {
            path,
            content,
        }
    })
    .map(({path, content}) => {
        console.log('server :: modularize', path);
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
                    ...contentLines.map(line => line
                        .replace('module.exports =', 'return')
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
            path,
        };
    })
    .map(({path, content}) => {
        console.log('server :: connect', path);
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
                console.log('server :: index', path);
                let contentLines = content.trim().split('\r\n');
                return `(()=>{${contentLines.join('\r\n')}})()`;
            })(),
            path,
        };
    });
const routes = server.splice(server.indexOf(server.find(({path}) => path.endsWith('routes.js'))), 1);
const manager = server.splice(server.indexOf(server.find(({path}) => path.endsWith('manager.js'))), 1);
const message = server.splice(server.indexOf(server.find(({path}) => path.endsWith('message.js'))), 1);
const ads = server.splice(server.indexOf(server.find(({path}) => path.endsWith('ads.js'))), 1);
const broadcast = server.splice(server.indexOf(server.find(({path}) => path.endsWith('broadcast.js'))), 1);
const clip = server.splice(server.indexOf(server.find(({path}) => path.endsWith('clip.js'))), 1);
const tweet = server.splice(server.indexOf(server.find(({path}) => path.endsWith('tweet.js'))), 1);
const marker = server.splice(server.indexOf(server.find(({path}) => path.endsWith('marker.js'))), 1);
const twip = server.splice(server.indexOf(server.find(({path}) => path.endsWith('twip.js'))), 1);
const commands = server.splice(server.indexOf(server.find(({path}) => path.endsWith('commands.js'))), 1);
const stream = server.splice(server.indexOf(server.find(({path}) => path.endsWith('stream.js'))), 1);
const index = server.splice(server.indexOf(server.find(({path}) => path.endsWith('index.js'))), 1);

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
    .map(({content, path}) => {
        console.log('output :: path', path);
        return ({content, path});
    })
    .map(({content, path}) => `/** start :: ${path} */\r\n${content}\r\n/** end :: ${path} */`)
    .join('\r\n');

[
    "actions",
    "actionsCreateEditor",
    "actionsCreateEmojis",
    "actionsCreateUpload",
    "actionsToggle",
    "applySignalsField",
    "applySignalsOrder",
    "castLayoutInputValues",
    "clearCanvas",
    "clearMemory",
    "clickUploadButton",
    "configFieldUpdate",
    "configureCertificate",
    "configureIp",
    "configureNunjucks",
    "configureSocket",
    "createChanges",
    "cssDevWatch",
    "dashboard",
    "dashboardBlinkButtons",
    "dashboardFilterButtons",
    "dashboardRotateHue",
    "dashboardSpinLabels",
    "displayMedia",
    "draw",
    "drawPixel",
    "emojiElsClick",
    "enableLayerDragDrop",
    "enableRadioButtons",
    "generateCopyLink",
    "generateQrCode",
    "getAllParams",
    "getBroadcasterId",
    "getChannelId",
    "getConfig",
    "getCssVariables",
    "getIp",
    "getParam",
    "getPath",
    "getPayloadValues",
    "getSecret",
    "getURL",
    "iframeDetect",
    "initHomeControls",
    "initNavControls",
    "initializeLayoutClickTouch",
    "paths",
    "publicConfigUpdate",
    "publicMediaFetch",
    "publicMediaUpdate",
    "publicSignalCreate",
    "publicStyleUpdate",
    "putConfig",
    "reducedMotion",
    "renderStringTemplate",
    "replayAudio",
    "replayStart",
    "resetSecrets",
    "scrollSnap",
    "send",
    "sendLayoutInputValues",
    "sendPayload",
    "sendToggleState",
    "setBroadcastTitle",
    "setCssVariable",
    "setFocusToken",
    "setMemory",
    "setModes",
    "setParam",
    "setSecret",
    "socketConnect",
    "socketEmitReload",
    "socketWatchDrawSet",
    "socketWatchFeatureSet",
    "socketWatchMediaSet",
    "socketWatchReload",
    "socketWatchRoute",
    "socketWatchSoundSet",
    "socketWatchStyle",
    "startServices",
    "textInputElBlur",
    "textInputElFocus",
    "toggleReplayState",
    "touchStartMove",
    "twitchAdCreate",
    "twitchClipCreate",
    "twitchLogin",
    "twitchLoginSuccess",
    "twitchMarkerCreate",
    "twitchMessageCreate",
    "twitchTwipCreate",
    "twitterTweet"
].forEach(methodName => {
    // output = output.replace(new RegExp(methodName, "gm"), `${methodName}2`)
});
fs.writeFileSync(
    './.server.js',
    output,
    {encoding: 'utf-8'}
);
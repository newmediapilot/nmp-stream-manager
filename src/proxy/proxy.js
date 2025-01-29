const socketIo = require("socket.io");
const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
app.set('trust proxy', true);
app.options('*', cors());
app.use(cors());
app.use(express.json({limit: '25mb'}));
const ROUTES = {
    API_MEDIA_GET: "/media/:path",
    API_MEMORY_GET: "/api/memory/get",
    API_MEMORY_SET: "/api/memory/set",
    API_CONFIG_SET: "/api/config/set",
    API_CONFIG_GET: "/api/config/get",
    API_STYLE_SET: "/api/style/set",
    API_STYLE_GET: "/api/style/get",
    API_SIGNAL_CREATE: "/api/signal/create",
    API_CONFIG_UPDATE: "/api/config/update",
    API_STYLE_UPDATE: "/api/style/update",
    API_MEDIA_UPDATE: "/api/media/update",
    UI_GET_INDEX: "/ui/index.html",
    UI_GET_DASHBOARD: "/ui/panel-dashboard.html",
    UI_GET_ACTIONS: "/ui/panel-actions.html",
    UI_GET_LAYOUT: "/ui/panel-layout.html",
    UI_GET_DRAW: "/ui/panel-draw.html",
    UI_GET_EMBED: "/ui/embed.html",
    UI_GET_FEATURE_EMBED: "/ui/embed-feature.html",
    UI_GET_MEDIA_EMBED: "/ui/embed-media.html",
    UI_GET_DRAW_EMBED: "/ui/embed-draw.html",
    UI_GET_SOUND_EMBED: "/ui/embed-sound.html",
    TWITCH_LOGIN: "/t/w/i/t/c/h/l/o/g/i/n/",
    TWITCH_LOGIN_SUCCESS: "/t/w/i/t/c/h/l/o/g/i/n/s/u/c/c/e/s/s/",
};
const time = new Date().getTime();
const salt = ((n) => Array.from({length: n}, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join(''))(5);
const hashify = (ip, key) => `${ip}${key}${salt}`;
const memory = {};
const media = {};
const ui = {};
const config = {};
const style = {};
const sockets = {};
const memorize = (req, key) => {
    const hash = hashify(req.ip, key);
    if (!sockets[hash]) return;
    if (!memory[hash] || !memory[hash].length) memory[hash] = [];
    const {method, url, body} = req;
    console.log(`proxy :: memorize :: ${hash} ${method} ${url} ${body}`);
    memory[hash].push(JSON.stringify([method, url, body]));
    sockets[hash].to('dbdbdbdbdbgroup').emit('sync');
};
[
    ROUTES.UI_GET_INDEX,
    ROUTES.UI_GET_DASHBOARD,
    ROUTES.UI_GET_ACTIONS,
    ROUTES.UI_GET_LAYOUT,
    ROUTES.UI_GET_DRAW,
    ROUTES.UI_GET_EMBED,
    ROUTES.UI_GET_FEATURE_EMBED,
    ROUTES.UI_GET_MEDIA_EMBED,
    ROUTES.UI_GET_DRAW_EMBED,
    ROUTES.UI_GET_SOUND_EMBED,
].map(route => {
    app.all(route, (req, res) => {
        if (!ui[route]) return res.status(404).send(`404 @ ui ${time}`);
        res.setHeader('Content-Type', 'text/html');
        res.send(ui[route]);
    });
});
[
    'demo',
].map(key => {
    app.all(`/${key}${ROUTES.TWITCH_LOGIN}`, (req, res) => {
        const redirectURI = `https://dbdbdbdbdbgroup.com/`;
        const oauthUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${process.env.TWITCH_CLIENT_ID}&redirect_uri=${redirectURI}&response_type=code&scope=${process.env.TWITCH_SCOPES}`;
        res.redirect(oauthUrl);
    });
    app.all(`${ROUTES.TWITCH_LOGIN_SUCCESS}`, (req, res) => {

    });
    app.all(`/${key}${ROUTES.API_CONFIG_SET}`, (req, res) => {
        const hash = hashify(req.ip, key);
        if (!sockets[hash]) return;
        config[hash] = req.query.payload;
        console.log(`proxy :: API_CONFIG_SET :: ${hash} ${JSON.stringify(config[hash]).substr(0, 50)}...`);
        res.send(`200 @ ${time}`);
    });
    app.all(`/${key}${ROUTES.API_CONFIG_GET}`, (req, res) => {
        const hash = hashify(req.ip, key);
        res.setHeader('Content-Type', 'application/json');
        res.send(config[hash]);
        console.log(`proxy :: API_CONFIG_GET :: ${hash} ${JSON.stringify(config[hash]).substr(0, 50)}...`);
    });
    app.all(`/${key}${ROUTES.API_STYLE_SET}`, (req, res) => {
        const hash = hashify(req.ip, key);
        if (!sockets[hash]) return;
        style[hash] = req.query.payload;
        console.log(`proxy :: API_STYLE_SET :: ${hash} ${style[hash]}`);
        res.send(`200 @ ${time}`);
    });
    app.all(`/${key}${ROUTES.API_STYLE_GET}`, (req, res) => {
        const hash = hashify(req.ip, key);
        res.setHeader('Content-Type', 'text/plain');
        res.send(style[hash]);
        console.log(`proxy :: API_STYLE_GET :: ${memory[hash] ? memory[hash].length : memory[hash]}`);
    });
    app.all(`/${key}${ROUTES.API_MEMORY_SET}`, (req, res) => {
        const hash = hashify(req.ip, key);
        const reqPath = req.body.path;
        const reqPayload = req.body.payload;
        if (!media[hash]) media[hash] = {};
        if (reqPath.endsWith('html')) {
            ui[reqPath] = Buffer.from(reqPayload, 'base64');
            console.log(`proxy :: API_MEMORY_SET :: ${reqPayload.length}`);
        } else {
            media[hash][reqPath] = Buffer.from(reqPayload, 'base64');
            console.log(`proxy :: API_MEMORY_SET :: ${reqPayload.length}`);
        }
        res.send(`200 @ ${time}`);
    });
    app.all(`/${key}${ROUTES.API_MEMORY_GET}`, (req, res) => {
        const hash = hashify(req.ip, key);
        res.setHeader('Content-Type', 'application/json');
        res.send(memory[hash]);
        console.log(`proxy :: API_MEMORY_GET :: ${memory[hash].length}`);
        memory[hash] = [];
    });
    app.all(`/${key}${ROUTES.API_MEDIA_GET}`, (req, res) => {
        const hash = hashify(req.ip, key);
        if (!media[hash]) return res.status(404).send(`404 @ media ${time}`);
        const keys = Object.keys(media[hash]);
        if (!keys.length) return res.status(404).send(`404 @ keys ${time}`);
        const reqPath = req.params.path;
        const reqPayload = keys
            .filter(k => k.includes(reqPath))
            .map(k => media[hash][k])
            .pop();
        if (!reqPayload) return res.status(404).send(`404 @ payload ${time}`);
        console.log(`proxy :: API_MEDIA_GET :: keys :: ${Object.keys(media[hash])} :1: ${reqPath} :2: ${reqPayload ? reqPayload.length : reqPayload}`);
        const mimeType = (() => {
            switch (path.extname(reqPath).toLowerCase()) {
                case '.jpeg':
                    return 'image/jpeg';
                case '.jpg':
                    return 'image/jpeg';
                case '.png':
                    return 'image/png';
                case '.gif':
                    return 'image/gif';
                case '.webp':
                    return 'image/webp';
                case '.bmp':
                    return 'image/bmp';
                case '.mp3':
                    return 'audio/mpeg';
                case '.wav':
                    return 'audio/wav';
                case '.webm':
                    return 'video/webm';
                default:
                    return 'application/octet-stream';
            }
        })();
        res.setHeader('Content-Type', mimeType);
        console.log("proxy :: API_MEDIA_GET :: sending...", req.params.path, mimeType);
        res.send(reqPayload);
    });
    app.all(`/${key}${ROUTES.API_MEDIA_UPDATE}`, (req, _) => {
        const hash = hashify(req.ip, key);
        const {data, type} = req.body;
        const name = req.body.key;
        if (!media[hash]) media[hash] = {};
        media[hash][`${name}.${type}`] = Buffer.from(data, 'base64');
        console.log(`proxy :: API_MEDIA_UPDATE :: ${media[hash]} ${hash} ${name}.${type}`);
        memorize(req, key);
    });
    app.all(`/${key}${ROUTES.API_SIGNAL_CREATE}`, (req, res) => {
        const hash = hashify(req.ip, key);
        if ("style" === req.query.type) {
            sockets[hash].to('dbdbdbdbdbgroup').emit('payload', `style:set:${req.query.description}`);
            console.log(`proxy :: API_SIGNAL_CREATE :: style ${req.query.description.length}`);
        } else {
            memorize(req, key);
        }
        res.send(`200 @ ${time}`);
    });
    [
        `/${key}${ROUTES.API_CONFIG_UPDATE}`,
        `/${key}${ROUTES.API_STYLE_UPDATE}`,
    ].map(path => {
        app.all(path, (req, res) => {
            memorize(req, key);
            res.send(`200 @ ${time}`);
        });
    });
});
app.all('/', (req, res) => res.send(`200 @ ${time}`));
const server = https
    .createServer({
        key: `${fs.readFileSync('.cert/cert.key', {encoding: "utf-8"})}`,
        cert: `${fs.readFileSync('.cert/cert.crt', {encoding: "utf-8"})}`,
    }, app)
    .listen(443, () => console.log('proxy :: server running'));
['demo'].map(key => {
    return {
        key,
        path: `/${key}/socket.io`
    }
}).map(({key, path}) => {
    const io = socketIo(server, {
        path,
        rejectUnauthorized: false,
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    io.on("connection", (socket) => {
        const hash = hashify(socket.handshake.address, key);
        sockets[hash] = io;
        socket.join('dbdbdbdbdbgroup');
        socket.on("payload", (payload) => sockets[hash].to('dbdbdbdbdbgroup').emit("payload", payload));
        socket.on("sync:done", () => sockets[hash].to('dbdbdbdbdbgroup').emit("sync:done"));
        console.log("proxy :: connected", hash, socket.id, socket.handshake.address, key);
        socket.on("disconnect", () => {
            console.log("proxy :: disconnected", hash, socket.id, socket.handshake.address, key)
        });
    });
    console.log("proxy :: created", key, path);
});
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
    API_STYLE_SET: "/api/style/set",
    API_SIGNAL_CREATE: "/api/signal/create",
    API_CONFIG_UPDATE: "/api/config/update",
    API_STYLE_UPDATE: "/api/style/update",
    API_MEDIA_UPDATE: "/api/media/update",
};
const time = new Date().getTime();
const salt = ((n) => Array.from({length: n}, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join(''))(5);
const hashify = (ip, key) => `${ip}${key}${salt}`;
const memory = {};
const media = {};
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
    'demo',
].map(key => {
    app.all(`/${key}${ROUTES.API_CONFIG_SET}`, (req, res) => {
        const hash = hashify(req.ip, key);
        if (!sockets[hash]) return;
        config[hash] = req.query.payload;
        sockets[hash].to('dbdbdbdbdbgroup').emit('payload', `config:set:${JSON.stringify(config[hash])}`);
        console.log(`proxy :: API_CONFIG_SET :: ${hash} ${JSON.stringify(config[hash]).substr(0,50)}...`);
        res.send(`200 @ ${time}`);
    });
    app.all(`/${key}${ROUTES.API_STYLE_SET}`, (req, res) => {
        const hash = hashify(req.ip, key);
        if (!sockets[hash]) return;
        style[hash] = req.query.payload;
        sockets[hash].to('dbdbdbdbdbgroup').emit('payload', `style:set:${style[hash]}`);
        console.log(`proxy :: API_STYLE_SET :: ${hash} ${style[hash]}`);
        res.send(`200 @ ${time}`);
    });
    app.all(`/${key}${ROUTES.API_MEMORY_GET}`, (req, res) => {
        const hash = hashify(req.ip, key);
        res.send(memory[hash]);
        console.log(`proxy :: API_MEMORY_GET :: ${memory[hash].length}`);
        memory[hash] = [];
    });
    app.all(`/${key}${ROUTES.API_MEMORY_SET}`, (req, res) => {
        const hash = hashify(req.ip, key);
        const reqPath = req.body.path;
        const reqPayload = req.body.payload;
        if (!media[hash]) media[hash] = {};
        media[hash][reqPath] = Buffer.from(reqPayload, 'base64');
        console.log(`proxy :: API_MEMORY_SET :: keys ${Object.keys(media[hash])}`);
        res.send(`200 @ ${time}`);
    });
    app.all(`/${key}${ROUTES.API_MEDIA_GET}`, (req, res) => {
        const hash = hashify(req.ip, key);
        if(!media[hash]) {
            return res.status(404).send(`404 @ ${time}`);
        }
        const keys = Object.keys(media[hash]);
        const reqPath = req.params.path;
        const reqPayload = keys
            .filter(k => k.includes(reqPath))
            .map(k => media[hash][k])
            .pop();
        console.log(`proxy :: API_MEDIA_GET :: keys ${Object.keys(media[hash])}`);
        const mimeType = (() => {
            switch (path.extname(reqPath).toLowerCase()) {
                case '.jpeg': return 'image/jpeg';
                case '.jpg': return 'image/jpeg';
                case '.png': return 'image/png';
                case '.gif': return 'image/gif';
                case '.webp': return 'image/webp';
                case '.bmp': return 'image/bmp';
                case '.mp3': return 'audio/mpeg';
                case '.wav': return 'audio/wav';
                case '.webm': return 'video/webm';
                default: return 'application/octet-stream';
            }
        })();
        res.setHeader('Content-Type', mimeType);
        res.send(reqPayload);
    });
    app.all(`/${key}${ROUTES.API_MEDIA_UPDATE}`, (req, res) => {
        const hash = hashify(req.ip, key);
        const {data, type} = req.body;
        const name = req.body.key;
        if (!media[hash]) media[hash] = {};
        media[hash][`${name}.${type}`] = Buffer.from(data, 'base64');
    });
    [
        `/${key}${ROUTES.API_SIGNAL_CREATE}`,
        `/${key}${ROUTES.API_CONFIG_UPDATE}`,
        `/${key}${ROUTES.API_STYLE_UPDATE}`,
        `/${key}${ROUTES.API_MEDIA_UPDATE}`,
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
[
    'demo',
].map(key => {
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
        socket.join('dbdbdbdbdbgroup');
        socket.on("payload", (payload) => socket.to('dbdbdbdbdbgroup').emit("payload", payload));
        socket.on("disconnect", () => {
            media[hash] = {};
            console.log("proxy :: disconnected", hash, socket.id, socket.handshake.address, key)
        });
        sockets[hash] = socket;
        style[hash] && sockets[hash].emit('payload', `style:set:${style[hash]}`);
        config[hash] && sockets[hash].emit('payload', `config:set:${JSON.stringify(config[hash])}`);
        console.log("proxy :: connected", hash, socket.id, socket.handshake.address, key);
    });
    console.log("proxy :: created", key, path);
});
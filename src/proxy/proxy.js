const socketIo = require("socket.io");
const express = require('express');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const app = express();
app.set('trust proxy', true);
app.options('*', cors());
app.use(cors());
const ROUTES = {
    API_MEMORY_GET: "/api/memory/get",
    API_MEMORY_SET: "/api/memory/set",
    API_SIGNAL_CREATE: "/api/signal/create",
    API_CONFIG_UPDATE: "/api/config/update",
    API_STYLE_UPDATE: "/api/style/update",
    API_MEDIA_UPDATE: "/api/media/update",
};
const time = new Date().getTime();
const salt = ((n) => Array.from({length: n}, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join(''))(5);
const memory = {};
const media = {};
const sockets = {};
const hashify = (ip, key) => {
    return `${ip}${key}${salt}`;
};
const memorize = (req, key) => {
    const hash = hashify(req.ip, key);
    if (req.path.endsWith(ROUTES.API_MEDIA_UPDATE)) {
        media[hash] = req;
    }
    if (!memory[hash]) memory[hash] = [];
    memory[hash].push(JSON.stringify({hash}));
    sockets[hash].emit('sync');
};
['demo'].map(key => {
    app.all(`/${key}${ROUTES.API_MEMORY_GET}`, (req, res) => {
        res.send(memory[hashify(req.ip, key)]);
    });
    app.all(`/${key}${ROUTES.API_MEMORY_SET}`, (req, res) => {
        res.send(`Success API_MEMORY_SET ${key} :: ${time}`);
    });
    app.all(`/${key}${ROUTES.API_SIGNAL_CREATE}`, (req, res) => {
        memorize(req, key);
        res.send(`Success API_SIGNAL_CREATE ${key} :: ${time}`);
    });
    app.all(`/${key}${ROUTES.API_CONFIG_UPDATE}`, (req, res) => {
        memorize(req, key);
        res.send(`Success API_CONFIG_UPDATE ${key} :: ${time}`);
    });
    app.all(`/${key}${ROUTES.API_STYLE_UPDATE}`, (req, res) => {
        memorize(req, key);
        res.send(`Success API_STYLE_UPDATE ${key} :: ${time}`);
    });
    app.all(`/${key}${ROUTES.API_MEDIA_UPDATE}`, (req, res) => {
        memorize(req, key);
        res.send(`Success API_MEDIA_UPDATE ${key} :: ${time}`);
    });
});
app.all('/', (req, res) => res.send(`200 @ ${time}`));
const server = https
    .createServer({
        key: `${fs.readFileSync('.cert/cert.key', {encoding: "utf-8"})}`,
        cert: `${fs.readFileSync('.cert/cert.crt', {encoding: "utf-8"})}`,
    }, app)
    .listen(443, () => console.log('Server running'));
['demo'].map(key => {
    return {
        key,
        path: `/${key}/socket.io`
    }
}).map(({key, path}) => {
    console.log("proxy :: create", key, path);
    const io = socketIo(server, {
        path,
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        },
    });
    io.on("connection", (socket) => {
        socket.on("disconnect", () => console.log("proxy :: disconnected", socket.handshake.address, key));
        sockets[hashify(socket.handshake.address, key)] = io;
        console.log("proxy :: connected", socket.handshake.address, key);
    });
    console.log("proxy :: ready", key, path);
});
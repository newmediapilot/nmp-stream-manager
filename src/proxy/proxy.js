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
    API_SIGNAL_CREATE: "/api/signal/create",
    API_CONFIG_UPDATE: "/api/config/update",
    API_STYLE_UPDATE: "/api/style/update",
    API_MEDIA_UPDATE: "/api/media/update",
};
const time = new Date().getTime();
const memory = [];
const config = {};
const media = {};
const style = {};
const sockets = {};
const hashify = (ip, key) => {
    return `${req.ip}${key}`;
};
const memorize = (req, key) => {
    const hash = hashify(req.ip, key);
    if (req.path.endsWith(ROUTES.API_CONFIG_UPDATE)) {
        config[hash] = req;//TODO: update in memory
    }
    if (req.path.endsWith(ROUTES.API_STYLE_UPDATE)) {
        style[hash] = req;//TODO: update in memory
    }
    if (req.path.endsWith(ROUTES.API_MEDIA_UPDATE)) {
        media[hash] = req;//TODO: update in memory
    }
    //TODO: push to mem-stack
    memory.push({hash, req});
    // TODO: notify app of change
    // TODO: app will read back the memory value and replay
    // TODO: app will send back config and style and write to mem
    sockets[hash].emit('sync');
};
['demo'].map(key => {
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
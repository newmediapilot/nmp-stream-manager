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
    API_MEDIA_GET: "/media/:path",
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
    if (!sockets[hash]) return;
    if (!memory[hash] || !memory[hash].length) memory[hash] = [];
    const {method, url, body} = req;
    memory[hash].push(JSON.stringify([method, url, body]));
    sockets[hash].to("dbdbdbdbdbgroup").emit('sync');
};
['demo'].map(key => {
    app.all(`/${key}${ROUTES.API_MEMORY_GET}`, (req, res) => {
        res.send(memory[hashify(req.ip, key)]);
        memory[hashify(req.ip, key)] = [];
        res.send(`Success API_MEMORY_GET ${req.url} ${key}`);
    });
    app.all(`/${key}${ROUTES.API_MEMORY_SET}`, (req, res) => {
        res.send(`Success API_MEMORY_SET ${req.url} ${key}`);
    });
    app.all(`/${key}${ROUTES.API_MEDIA_GET}`, (req, res) => {
        res.send(`Success API_MEDIA_GET ${req.url} ${key} ${req.params.path}`);
    });
    [
        `/${key}${ROUTES.API_SIGNAL_CREATE}`,
        `/${key}${ROUTES.API_CONFIG_UPDATE}`,
        `/${key}${ROUTES.API_STYLE_UPDATE}`,
        `/${key}${ROUTES.API_MEDIA_UPDATE}`,
    ].map(path => {
        app.all(path, (req, res) => {
            memorize(req, key);
            res.send(`Success API_SIGNAL_CREATE ${req.url} ${key}`);
        });
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
        rejectUnauthorized: false,
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    io.on("connection", (socket) => {
        console.log("proxy :: connection", socket.handshake.address, key);
        socket.join("dbdbdbdbdbgroup");
        socket.on("payload", (payload) => {
            socket.to("dbdbdbdbdbgroup").emit("payload", payload);
            console.log("proxy :: payload", payload);
        });
        sockets[hashify(socket.handshake.address, key)] = socket;
        socket.on("disconnect", () => {
            console.log("proxy :: disconnected", socket.handshake.address, key);
            sockets[hashify(socket.handshake.address, key)] = null;
            memory[hashify(socket.handshake.address, key)] = {};
        });
        console.log("proxy :: connected", socket.handshake.address, key);
    });
    console.log("proxy :: ready", key, path);
});
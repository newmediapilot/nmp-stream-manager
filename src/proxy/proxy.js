const socketIo = require("socket.io");
const express = require('express');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const app = express();
const time = new Date().getTime();
const ROUTES = {
    API_SIGNAL_CREATE: "/api/signal/create",
    API_CONFIG_UPDATE: "/api/config/update",
    API_STYLE_UPDATE: "/api/style/update",
    API_MEDIA_UPDATE: "/api/media/update",
};
app.options('*', cors());
app.use(cors());
['demo'].forEach(key => {
    app.all(`/${key}${ROUTES.API_SIGNAL_CREATE}`, (req, res) => res.send(`API_SIGNAL_CREATE ${key}`));
    app.all(`/${key}${ROUTES.API_CONFIG_UPDATE}`, (req, res) => res.send(`API_CONFIG_UPDATE ${key}`));
    app.all(`/${key}${ROUTES.API_STYLE_UPDATE}`, (req, res) => res.send(`API_STYLE_UPDATE ${key}`));
    app.all(`/${key}${ROUTES.API_MEDIA_UPDATE}`, (req, res) => res.send(`API_MEDIA_UPDATE ${key}`));
});
app.all('/', (req, res) => res.send(`200 @ ${time}`));
const server = https
    .createServer({
        key: `${fs.readFileSync('.cert/cert.key', {encoding: "utf-8"})}`,
        cert: `${fs.readFileSync('.cert/cert.crt', {encoding: "utf-8"})}`,
    }, app)
    .listen(443, () => console.log('Server running'));
[
    '/demo/socket.io',
].map(path => {
    console.log("proxy :: created", path);
    const io = socketIo(server, {
        path,
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        },
    });
    io.on("connection", (socket) => {
        console.log("proxy :: connected", path);
        socket.on("disconnect", () => console.log("proxy :: disconnected", path));
    });
});
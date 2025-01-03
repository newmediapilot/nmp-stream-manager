const socketIo = require("socket.io");
const express = require('express');
const https = require('https');
const app = express();
const {ROUTES} = require('../server/routes');
app.use((req, res, next) => {
    if (['demo'].find(key => req.path.includes(key))) return next();
    res.status(403).send('403');
});
app.all(`/${ROUTES.API_SIGNAL_CREATE}`, (req, res) => res.send(`ROUTES.API_SIGNAL_CREATE`));
app.all(`/${ROUTES.API_CONFIG_UPDATE}`, (req, res) => res.send(`ROUTES.API_CONFIG_UPDATE`));
app.all(`/${ROUTES.API_STYLE_UPDATE}`, (req, res) => res.send(`ROUTES.API_STYLE_UPDATE`));
app.all(`/${ROUTES.API_MEDIA_UPDATE}`, (req, res) => res.send(`ROUTES.API_MEDIA_UPDATE`));
app.all('/', (req, res) => res.send(`200`));
const httpsServer = https
    .createServer({
        key: `key-xxx`,
        cert: `cert-xxx`,
    }, app)
    .listen(443, () => {
        console.log('Server running');
    });
[
    '/demo/socket.io',
].map(path => {
    console.log("proxy :: created", path);
    const io = socketIo(httpsServer, {path});
    io.on("connection", (socket) => {
        console.log("proxy :: connected", path);
        socket.on("disconnect", () => console.log("proxy :: disconnected", path));
    });
});
const socketIo = require("socket.io");
const express = require('express');
const https = require('https');
const app = express();
const ROUTES = {
    API_SIGNAL_CREATE: "/api/signal/create",
    API_CONFIG_UPDATE: "/api/config/update",
    API_STYLE_UPDATE: "/api/style/update",
    API_MEDIA_UPDATE: "/api/media/update",
};
const time = new Date().getTime();
app.use((req, res, next) => {
    if (['demo'].find(key => req.path.includes(key))) {
        if (req.path.endsWith(ROUTES.API_CONFIG_UPDATE)) {
            res.status(200).send('ROUTES.API_CONFIG_UPDATE');
        }
        if (req.path.endsWith(ROUTES.API_CONFIG_UPDATE)) {
            res.status(200).send('ROUTES.API_CONFIG_UPDATE');
        }
        if (req.path.endsWith(ROUTES.API_STYLE_UPDATE)) {
            res.status(200).send('ROUTES.API_STYLE_UPDATE');
        }
        if (req.path.endsWith(ROUTES.API_MEDIA_UPDATE)) {
            res.status(200).send('ROUTES.API_MEDIA_UPDATE');
        }
    } else {
        res.status(403).send(`403@${time}`);
    }
});
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
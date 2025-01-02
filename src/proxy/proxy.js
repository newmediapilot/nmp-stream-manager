const socketIo = require("socket.io");
const express = require('express');
const https = require('https');
const app = express();
app.all('/', (req, res) => res.send(`${req.path}`));
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
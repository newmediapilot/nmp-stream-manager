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
const io = socketIo(httpsServer, {
    path: '/demo/socket.io'
});
io.on("connection", (socket) => {
    console.log("proxy :: client connected", socket.handshake.address);
    socket.on("disconnect", () => console.log("proxy :: client disconnected"));
});
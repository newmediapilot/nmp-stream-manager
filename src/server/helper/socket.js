const ioClient = require("socket.io-client");
const {getMemory} = require("../public/memory");
let io;
const configureSocket = (server) => {
    io = ioClient("https://api.dbdbdbdbdbgroup.com", {
        path: '/demo/socket.io',
        transports: ["websocket"],
    });
    io.on("connection", (socket) => {
        console.log("configureSocket :: client connected", socket.handshake.address);
        socket.on("sync", () => {
            console.log('configureSocket :: sync', getMemory.toString());
        });
        socket.on("disconnect", () => console.log("configureSocket :: client disconnected"));
    });
    console.log("sendPayload :: configureSocket");
};
const sendPayload = (payload) => {
    if (!io) {
        console.log("sendPayload :: socket.IO is not configured. Call configureSocket first.");
        return false;
    }
    if (!payload) {
        console.log("sendPayload :: payload is required");
        return false;
    }
    try {
        io.emit("payload", payload);
        console.log("sendPayload :: sending payload:", payload);
        return true;
    } catch (err) {
        console.log("sendPayload :: error sending payload:", err);
        return false;
    }
};
module.exports = {configureSocket, sendPayload};
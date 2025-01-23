const ioClient = require("socket.io-client");
const {getMemory} = require("../public/memory");
let io;
const configureSocket = () => {
    io = ioClient("https://api.dbdbdbdbdbgroup.com", {
        path: '/demo/socket.io',
        rejectUnauthorized: false,
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    io.on("connect", () => {
        console.log("configureSocket :: client connect socket.id", io.id);
    });
    io.on("sync", () => {
        console.log("configureSocket :: sync", io.id);
        getMemory();
    });
    io.on("disconnect", () => console.log("configureSocket :: client disconnected"));
    io.on("connect_error", (err) => console.log("configureSocket :: connection offline"));
    console.log("configureSocket :: configureSocket initialized");
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
        io.emit("payload", payload, (response) => {
            console.log("sendPayload :: sending payload response:", response, payload);
        });
        console.log("sendPayload :: sending payload:", payload);
        return true;
    } catch (err) {
        console.log("sendPayload :: error payload");
        return false;
    }
};
module.exports = {configureSocket, sendPayload};
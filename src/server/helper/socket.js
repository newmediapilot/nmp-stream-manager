const fetch = require("node-fetch");
const socketIo = require("socket.io");
const {getParam} = require("../store/manager");
let io;
const configureSocket = (server) => {
    io = socketIo(server, {
        cors: {
            origin: "https://dbdbdbdbdbgroup.com",
            methods: ["GET", "POST"],
            credentials: true,
        }
    });
    io.on("connection", (socket) => {
        console.log("configureSocket :: client connected", socket.handshake.address);
        socket.on("request", handleRequestMessage);
        socket.on("disconnect", () => console.log("configureSocket :: client disconnected"));
    });
    console.log("sendPayload :: configureSocket");
};
const handleRequestMessage = (data) => {
    console.log("configureSocket :: handleRequestMessage", data);
    if ("index" === data) {
        const {INDEX} = getParam("public_routes");
        const IP = getParam("device_ip");
        fetch(`https://${IP}${INDEX}`, {method: 'GET'})
            .then(result => io.emit("response:index", result))
            .catch(e => {
                console.log("sentRequestResponse :: error ::", e);
            });
        console.log("sentRequestResponse");
    }
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
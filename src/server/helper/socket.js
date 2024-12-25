const socketIo = require("socket.io");
let io;
const configureSocket = (server) => {
    if (!server) {
        throw new Error("configureSocket :: server instance is required to configure Socket.IO.");
    }
    io = socketIo(server, {
        cors: {
            origin: "https://dbdbdbdbdbgroup.com",
            methods: ["GET", "POST"],
            credentials: true,
        }
    });
    io.on("connection", (socket) => {
        console.log('socket', socket.handshake.address);
        console.log(process.cwd(), "configureSocket :: client connected");
        socket.on("payload", (data) => {
            console.log(process.cwd(), "configureSocket :: received payload from client:", data);
            ("request:index" === data) && sentRequestResponse(data.split(":")[1]);
        });
        socket.on("disconnect", () => {
            console.log(process.cwd(), "configureSocket :: client disconnected");
        });
    });
    console.log(process.cwd(), "sendPayload :: socket.IO configured and attached to server.");
};
const sentRequestResponse = (type) => {
    console.log("sentRequestResponse");
    (type === "index") && io.emit("payload", "response:index");
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
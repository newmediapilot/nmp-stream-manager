const socketIo = require("socket.io");
let io;
const configureSocket = (server) => {
    if (!server) {
        throw new Error("Server instance is required to configure Socket.IO.");
    }
    io = socketIo(server);
    io.on("connection", (socket) => {
        console.log('socket', socket.handshake.address);
        console.log2(process.cwd(), "Client connected");
        socket.on("message", (data) => {
            console.log2(process.cwd(), "Received message from client:", data);
        });
        socket.on("disconnect", () => {
            console.log2(process.cwd(), "Client disconnected");
        });
    });
    console.log2(process.cwd(), "Socket.IO configured and attached to server.");
};
const sendPayload = (payload) => {
    if (!io) {
        console.error("Socket.IO is not configured. Call configureSocket first.");
        return false;
    }
    if (!payload) {
        console.error("Payload is required");
        return false;
    }
    try {
        io.emit("payload", payload);
        return true;
    } catch (err) {
        console.error("Error sending payload:", err);
        return false;
    }
};
module.exports = {configureSocket, sendPayload};

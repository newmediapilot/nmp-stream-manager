const socketIo = require("socket.io");
let io;
const configureSocket = (server) => {
    if (!server) {
        throw new Error("Server instance is required to configure Socket.IO.");
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
        console.log(process.cwd(), "Client connected");
        socket.on("message", (data) => {
            console.log(process.cwd(), "Received message from client:", data);
        });
        socket.on("disconnect", () => {
            console.log(process.cwd(), "Client disconnected");
        });
    });
    console.log(process.cwd(), "Socket.IO configured and attached to server.");
};
const sendPayload = (payload) => {
    if (!io) {
        console.log("Socket.IO is not configured. Call configureSocket first.");
        return false;
    }
    if (!payload) {
        console.log("Payload is required");
        return false;
    }
    try {
        io.emit("payload", payload);
        console.log("Sending payload:", payload);
        return true;
    } catch (err) {
        console.log("Error sending payload:", err);
        return false;
    }
};
module.exports = {configureSocket, sendPayload};

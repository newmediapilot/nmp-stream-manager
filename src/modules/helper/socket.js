const socketIo = require("socket.io");
// Share between functions
let io;

/**
 * Configures Socket.IO with the provided HTTPS server.
 * @param {Object} server - The HTTPS server instance (already configured for 443).
 */
const configureSocket = (server) => {

    if (!server) {
        throw new Error("Server instance is required to configure Socket.IO.");
    }

    io = socketIo(server); // Attach Socket.IO to the server

    // Handle connection events
    io.on("connection", (socket) => {
        console.log("Client connected");

        // Listen for custom events from clients
        socket.on("message", (data) => {
            console.log("Received message from client:", data);
        });

        // Handle client disconnections
        socket.on("disconnect", () => {
            console.log("Client disconnected");
        });
    });

    console.log("Socket.IO configured and attached to server.");
}

/**
 * Sends a payload to all connected clients via a custom event.
 * @param {Object} payload - The payload to send to connected clients.
 * @returns {boolean} - True if successful, false if an error occurs.
 */
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
        io.emit("payload", payload); // Emit the payload to all connected clients
        return true;
    } catch (err) {
        console.error("Error sending payload:", err);
        return false;
    }
}

module.exports = {configureSocket, sendPayload};

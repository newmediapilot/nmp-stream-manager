const io = require("socket.io")();

const sendPayload = (payload) => {
    if (!payload) {
        console.error("Payload is required");
        return false;
    }
    try {
        io.emit("customEvent", payload);
        return true;
    } catch (err) {
        console.error("Error sending payload:", err);
        return false;
    }
};

module.exports = { io, sendPayload };
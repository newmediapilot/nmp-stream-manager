const socketConnect = () => {
    const socket = io();
    socket.on("customEvent", (payload) => {
        console.log("Received payload:", payload);
    });
    socket.on("connect_error", (err) => {
        console.error("Socket connection error:", err);
    });
    socket.on("connect", () => {
        console.log("Connected to the socket server");
    });
};
//
socketConnect();
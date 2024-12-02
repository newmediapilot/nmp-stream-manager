const socketConnect = (callback) => {
    const socket = io();
    socket.on("payload", (data) => callback(data));
    socket.on("connect_error", (err) => console.error("Socket connection error:", err));
    socket.on("connect", () => console.log("Connected to the socket server"));
};

const socketEmitReload = () => axios.get('/public/signal/create?type=browser&description=reload');

const socketWatchReload = () => {
    socketConnect((payload) => ('browser:reload' === payload) && window.location.reload());
};
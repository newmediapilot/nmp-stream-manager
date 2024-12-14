let $socketIO = null;// "private" variable
const socketConnect = () => {
    if ($socketIO) return;
    $socketIO = io();
    $socketIO.on("connect_error", (err) =>
        console.error("Socket connection error:", err),
    );
    $socketIO.on("connect", () => console.log("Connected to the socket server"));
    console.log("Socket connection start");
};
const socketWatchStyle = (callback) => {
    console.log("socketWatchStyle");
    $socketIO.on("payload", (payload) => {
        payload.startsWith('style:set:') && callback(payload);
    });
};
const socketWatchFeatureSet = (callback) => {
    console.log("socketWatchFeatureSet");
    $socketIO.on("payload", (payload) => {
        payload.startsWith('feature:set:') && callback(payload);
    });
};
const socketWatchDrawSet = (callback) => {
    console.log("socketWatchDrawRecording");
    $socketIO.on("payload", (payload) => {
        payload.startsWith('draw:') && callback(payload);
    });
};
const socketEmitReload = () => {
    axios.get("/api/signal/create?type=browser&description=reload");
};
// Socket will only emit reload for pages which are inactive
const socketWatchReload = () => {
    console.log("socketWatchReload");
    const timeout = 3000;
    let to = null;
    const setFocusToken = () => {
        if (to) clearTimeout(to);
        document.documentElement.classList.add('socket-watch-reload-focus');
        to = setTimeout(() => {
            document.documentElement.classList.remove('socket-watch-reload-focus');
        }, timeout);
    };
    setFocusToken();
    document.documentElement.querySelectorAll('*').forEach((e) => e.addEventListener('touchstart', setFocusToken));
    document.documentElement.querySelectorAll('*').forEach((e) => e.addEventListener('touchend', setFocusToken));
    document.documentElement.querySelectorAll('*').forEach((e) => e.addEventListener('mousedown', setFocusToken));
    document.documentElement.querySelectorAll('*').forEach((e) => e.addEventListener('mouseup', setFocusToken));
    $socketIO.on("payload", (payload) => {
        if ("browser:reload" === payload) {
            !document.documentElement.classList.contains('socket-watch-reload-focus') && window.location.reload();
        }
    });
};
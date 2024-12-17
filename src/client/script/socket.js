let $socketIO = null;// "private" variable
const socketConnect = () => {
    if ($socketIO) return;
    $socketIO = io();
    $socketIO.on("connect_error", (err) =>
        console.log("socketConnect :: connection error:", err),
    );
    $socketIO.on("connect", () => console.log("socketConnect :: connected to the socket server"));
    console.log("socketConnect :: socket connection start");
};
const socketWatchStyle = (callback) => {
    console.log("socketConnect :: socketWatchStyle");
    $socketIO.on("payload", (payload) => {
        payload.startsWith('style:set:') && callback(payload);
    });
};
const socketWatchFeatureSet = (callback) => {
    console.log("socketConnect :: socketWatchFeatureSet");
    $socketIO.on("payload", (payload) => {
        payload.startsWith('feature:set:') && callback(payload);
    });
};
const socketWatchSoundSet = (callback) => {
    console.log("socketConnect :: socketWatchFeatureSet");
    $socketIO.on("payload", (payload) => {
        payload.startsWith('sound:') && callback(payload);
    });
};
const socketWatchDrawSet = (callback) => {
    console.log("socketConnect :: socketWatchDrawRecording");
    $socketIO.on("payload", (payload) => {
        payload.startsWith('draw:') && callback(payload);
    });
};
const socketEmitReload = () => {
    axios.get("/api/signal/create?type=browser&description=reload");
};
// Socket will only emit reload for pages which are inactive
const socketWatchReload = () => {
    console.log("socketConnect :: socketWatchReload");
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
    window.addEventListener('touchstart', setFocusToken);
    window.addEventListener('touchend', setFocusToken);
    window.addEventListener('mousedown', setFocusToken);
    window.addEventListener('mouseup', setFocusToken);
    window.addEventListener('keydown', setFocusToken);
    window.addEventListener('keyup', setFocusToken);
    $socketIO.on("payload", (payload) => {
        if ("browser:reload" === payload) {
            !document.documentElement.classList.contains('socket-watch-reload-focus') && window.location.reload();
        }
    });
};
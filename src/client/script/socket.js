const socketConnect = () => {
    if (document.$socketIO) return;
    document.$socketIO = io("https://api.dbdbdbdbdbgroup.com", {
        path: '/demo/socket.io',
    });
    document.$socketIO.on("connect_error", (err) =>
        console.log("socketConnect :: connection error:", err),
    );
    document.$socketIO.on("connect", () => {
        console.log("socketConnect :: connected to the socket server document.$socketIO.id", document.$socketIO.id);
    });
    console.log("socketConnect :: socket connection start");
};
const socketWatchStyle = (callback) => {
    console.log("socketConnect :: socketWatchStyle");
    document.$socketIO.on("payload", (payload) => {
        payload.startsWith('style:set:') && callback(payload);
    });
};
const socketWatchFeatureSet = (callback) => {
    console.log("socketConnect :: socketWatchFeatureSet");
    document.$socketIO.on("payload", (payload) => {
        payload.startsWith('feature:set:') && callback(payload);
    });
};
const socketWatchMediaSet = (callback) => {
    console.log("socketConnect :: socketWatchImageSet");
    document.$socketIO.on("payload", (payload) => {
        payload.startsWith('media:') && callback(payload);
    });
};
const socketWatchSoundSet = (callback) => {
    console.log("socketConnect :: socketWatchFeatureSet");
    document.$socketIO.on("payload", (payload) => {
        payload.startsWith('sound:') && callback(payload);
    });
};
const socketWatchDrawSet = (callback) => {
    console.log("socketConnect :: socketWatchDrawRecording");
    document.$socketIO.on("payload", (payload) => {
        payload.startsWith('draw:') && callback(payload);
    });
};
const socketWatchRoute = (callback) => {
    console.log("socketConnect :: socketWatchRoute");
    document.$socketIO.on("payload", (payload) => {
        payload.startsWith('browser:route:') && callback(payload);
    });
};
const socketEmitReload = () => {
    axios.get(`${getPath("API_SIGNAL_CREATE")}?type=browser&description=reload`);
};
const setFocusToken = () => {
    const timeout = 3000;
    if (document.$setFocusTokenTo) clearTimeout(document.$setFocusTokenTo);
    document.documentElement.classList.add('socket-watch-reload-focus');
    document.$setFocusTokenTo = setTimeout(() => {
        document.documentElement.classList.remove('socket-watch-reload-focus');
    }, timeout);
};
const socketWatchReload = () => {
    console.log("socketConnect :: socketWatchReload");
    window.addEventListener('touchstart', setFocusToken);
    window.addEventListener('touchend', setFocusToken);
    window.addEventListener('mousedown', setFocusToken);
    window.addEventListener('mouseup', setFocusToken);
    window.addEventListener('keydown', setFocusToken);
    window.addEventListener('keyup', setFocusToken);
    document.$socketIO.on("payload", (payload) => {
        if ('#edit' === window.location.hash) return;
        if ("browser:reload" === payload) {
            !document.documentElement.classList.contains('socket-watch-reload-focus') && window.location.reload();
        }
    });
};
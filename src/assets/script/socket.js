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

const socketWatchStyle = () => {
    socketConnect();
    console.log("socketWatchStyle");
    $socketIO.on("browser:style", (payload) => {
        // Here, you are listening for the specific event name ("browser:style")
        console.log('style event received', payload);
    });
};

const socketEmitStyle = (payload) => {
    console.log("socketEmitStyle");
    $socketIO.emit("browser:style", payload);
};

const socketEmitReload = () => {
    axios.get("/public/signal/create?type=browser&description=reload");
};

// Socket will only emit reload for pages which are inactive
const socketWatchReload = () => {
    socketConnect();

    console.log("socketWatchReload");

    const timeout = 3000;
    let to = null;

    const setFocusToken = () => {
        if (to) clearTimeout(to);
        document.documentElement.classList.add('focus');
        to = setTimeout(() => document.documentElement.classList.remove('focus'), timeout);
    };

    document.documentElement.querySelectorAll('*').forEach((e) => e.addEventListener('touchstart', setFocusToken));
    document.documentElement.querySelectorAll('*').forEach((e) => e.addEventListener('touchend', setFocusToken));
    document.documentElement.querySelectorAll('*').forEach((e) => e.addEventListener('mousedown', setFocusToken));
    document.documentElement.querySelectorAll('*').forEach((e) => e.addEventListener('mouseup', setFocusToken));

    $socketIO.on("payload", (payload) => {
        if ("browser:reload" === payload) {
            const isFocusedActiveWindow = document.documentElement.classList.contains('focus');
            !isFocusedActiveWindow && window.location.reload();
        }
    });
};

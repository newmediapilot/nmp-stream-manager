const socketConnect = (callback) => {
    const socket = io();
    socket.on("payload", (data) => callback(data));
    socket.on("connect_error", (err) =>
        console.error("Socket connection error:", err),
    );
    socket.on("connect", () => console.log("Connected to the socket server"));
};

const socketEmitReload = () => {
    axios.get("/public/signal/create?type=browser&description=reload");
};

// Socket will only emit reload for pages which are inactive
// Anytime a page becomes in focus it will be given a focus token
// If the token expires the page will reload on the next request
const socketWatchReload = () => {

    // If a page is inactive for 3seconds it will become inactive
    // A page only becomes active on events below
    const timeout = 3000;
    let to = null;

    const setFocusToken = () => {
        if (to) clearTimeout(to);
        document.documentElement.classList.add('focus');
        to = setTimeout(() => document.documentElement.classList.remove('focus'), timeout);
    };

    // TODO: rewrite this as a utility
    document.documentElement.querySelectorAll('*').forEach((e) => e.addEventListener('touchstart', setFocusToken));
    document.documentElement.querySelectorAll('*').forEach((e) => e.addEventListener('touchend', setFocusToken));
    document.documentElement.querySelectorAll('*').forEach((e) => e.addEventListener('mousedown', setFocusToken));
    document.documentElement.querySelectorAll('*').forEach((e) => e.addEventListener('mouseup', setFocusToken));

    socketConnect(
        (payload) => {
            if ("browser:reload" === payload) {
                const isFocusedActiveWindow = document.documentElement.classList.contains('focus');
                !isFocusedActiveWindow && window.location.reload();
            }
        },
    );
};

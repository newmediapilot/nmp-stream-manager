const getURL = (path) => {
    if (window.self !== window.top) {
        socketEmitRoute();
    } else {
        window.location.href = path;
    }
};
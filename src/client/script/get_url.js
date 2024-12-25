const getURL = (path) => {
    if (window.self !== window.top) {
        console.log('Sending message to $socketIO', path);
        document.$socketIO.emit("path", path);
    } else {
        window.location.href = path;
    }
};
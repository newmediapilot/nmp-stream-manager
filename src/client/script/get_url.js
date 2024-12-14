const getURL = (path) => {
    if (window.self !== window.top) {
        window.parent.postMessage(
            {type: 'path', message: path},
            window.location.origin
        );
    } else {
        window.location.href = path;
    }
};
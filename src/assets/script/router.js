const getURL = (path) => {
    window.parent.postMessage(path, '*');
    window.location.href = path;
};
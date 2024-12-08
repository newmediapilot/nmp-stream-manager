const getURL = (path) => {
    // TODO: implement the real thing
    document.querySelectorAll('#menu-toggle').forEach(el => el.checked = false)
    if (window.self !== window.top) {
        window.parent.postMessage(
            {type: 'path', message: path},
            window.location.origin
        );
    } else {
        window.location.href = path;
    }
};
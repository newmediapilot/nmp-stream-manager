const getURL = (path) => {
    document.querySelectorAll('#toggle-nav-show').forEach(el => el.checked = false);// TODO: implement the real thing
    if (window.self !== window.top) {
        window.parent.postMessage(
            {type: 'path', message: path},
            window.location.origin
        );
    } else {
        window.location.href = path;
    }
};
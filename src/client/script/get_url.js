const getURL = (path) => {
    console.log('getURL ::', path);
    if (window.self !== window.top) {
        console.log('getURL :: iframe', window.parent);
        window.parent.postMessage(
            {type: 'path', message: path},
            window.location.origin
        );
    } else {
        console.log('getURL :: !iframe');
        window.location.href = path;
    }
};
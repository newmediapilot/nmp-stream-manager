const getURL = (path) => {
    if (window.self !== window.top) {
        console.log('Sending message to parent', window.parent);
        window.top.postMessage(
            {type: 'path', message: path},
            '*'
        );
    } else {
        console.log('getURL :: Not in an iframe');
        window.location.href = path;
    }
};
const getURL = (path) => {
    if (window.self !== window.top) {
        console.log('Sending message to parent', window.parent);



        window.top.postMessage(
            {type: 'path', message: path},
            '*'
        );



    } else {
        window.location.href = path;
    }
};
const getURL = (path) => {
    if (window.self !== window.top) {
        console.log('Sending message to parent');
        // Correctly use postMessage to communicate with the parent
        window.parent.postMessage(
            {type: 'path', message: path},
            'https://192.168.0.22' // Ensure this matches the protocol and domain of the parent page
        );
    } else {
        console.log('getURL :: Not in an iframe');
        window.location.href = path;
    }
};
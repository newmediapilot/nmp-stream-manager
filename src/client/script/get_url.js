const getURL = (path) => {
    if (window.self !== window.top) {
        axios.get(`${getPath("API_SIGNAL_CREATE")}?type=browser&description=route:${path}`);
    } else {
        window.location.href = path;
    }
};
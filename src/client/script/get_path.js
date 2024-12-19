const getPath = (key) => {
    return document.head.querySelector(`meta[name="${key}"]`).getAttribute('content');
};
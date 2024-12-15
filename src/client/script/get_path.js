const getPath = (key) => {
    return document.head.querySelector(`meta[${key}]`).getAttribute('content');
};
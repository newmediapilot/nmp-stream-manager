const iframeDetect = () => {
    if (window.self !== window.top) document.documentElement.classList.add('iframe');
};
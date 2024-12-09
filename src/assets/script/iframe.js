// Detect if we are in an iframe and add the class
const iframeDetect = () => {
    if (window.self !== window.top) document.documentElement.classList.add('iframe');
};
const editDetect = () => {
    if(document.location.hash === '#edit') {
        document.documentElement.classList.add('iframe');
    }
};
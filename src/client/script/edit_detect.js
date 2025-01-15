const editDetect = () => {
    if (document.location.hash.includes('edit')) {
        document.documentElement.classList.add('edit');
    }
};
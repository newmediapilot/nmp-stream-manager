const generateCopyLink = (linkButtonElement) => {
    linkButtonElement.addEventListener('click', () => {
        navigator.clipboard.writeText(linkButtonElement.getAttribute('data-url'));
    });
};
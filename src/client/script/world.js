const enableWorldNav = () => {
    document.querySelector('aside').style.visibility = 'visible';
};
const configureWorldNav = () => {
    document.querySelectorAll('aside button').forEach((button, index) => {
        button.addEventListener('click', () => {
            const iframe = document.querySelector('main').children[index];
            axios.get(`${getPath("API_SIGNAL_CREATE")}?type=browser&description=route:${iframe.src.split('/').pop()}`);
            document.querySelector('aside').style.visibility = 'hidden';
        });
    });
};
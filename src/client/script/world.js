const enableWorldNav = () => {
    document.querySelector('aside').style.visibility = 'visible';
};
const disableWorldNav = () => {
    document.querySelector('aside').style.visibility = 'hidden';
};
const configureWorldNav = () => {
    document.querySelectorAll('aside button').forEach((button, index) => {
        const {src} = document.querySelector('main').children[index];
        console.log('src', src);
    });
};
const navigateWorld = (e) => {
    console.log(e.target);
    disableWorldNav();
};
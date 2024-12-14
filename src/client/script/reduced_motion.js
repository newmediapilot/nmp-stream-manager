const reducedMotion = () => {
    document.documentElement.classList.add('reduced-motion');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.classList.add('reduced-motion');
        console.log('reducedMotion :: active');
    } else {
        console.log('reducedMotion :: off');
    }
};
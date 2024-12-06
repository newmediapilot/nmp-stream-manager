const scrollSnap = (elQueryString) => {
    let to = null;
    let anim = null;
    let duration = 1000;
    let containerEl = document.querySelector(elQueryString);
    const scrollFunct = () => {
        if(to) {
            clearTimeout(to);
        }
        to = setTimeout(() => {
            const closestToTopEls = Array.from(containerEl.children).map(el=>el.getBoundingClientRect().top);
            console.log('closestToTopEls',JSON.stringify(closestToTopEls));
            // TODO: figure out perfection scrollsnap
            anim && anime.remove();
            anim = anime({
                // scrollTop,
                duration: duration,
                targets: elQueryString,
                easing: 'easeInOutQuad'
            });
        }, duration);
    };
    document.documentElement.addEventListener('touchstart', () => clearTimeout(to));
    document.documentElement.addEventListener('mousedown', () => clearTimeout(to));
    document.documentElement.addEventListener('touchend', () => scrollFunct());
    document.documentElement.addEventListener('mouseup', () => scrollFunct());
    document.documentElement.addEventListener('wheel', () => scrollFunct());
};
const scrollSnap = (elQueryString) => {
    let to = null;
    let anim = null;
    let duration = 1000;
    let containerEl = document.querySelector(elQueryString);
    const scrollFunct = () => {
        to && clearTimeout(to);
        to = setTimeout(() => {

            const closestToTopEls = Array.from(containerEl.children);

            console.log('closestToTopEls', closestToTopEls);
            console.log('closestToTopEls', closestToTopEls.length);


            const closestToTopEl = closestToTopEls[0];
            const closestToTopElOffset = closestToTopEl.getBoundingClientRect().top;
            const containerElOffset = containerEl.scrollTop;
            console.log('containerEl', containerEl);
            console.log('closestToTopEl', closestToTopEl);
            console.log('closestToTopElOffset', closestToTopElOffset);
            console.log('containerElOffset', containerElOffset);
            anim && anime.remove();
            anim = anime({
                // scrollTop: closestToTopElOffset -containerElOffset,
                duration: 333,
                targets: elQueryString,
                easing: 'easeInOutQuad'
            });
        }, duration);
    };
    document.documentElement.addEventListener('touchstart', ()=>clearTimeout(to));
    document.documentElement.addEventListener('mousedown', ()=>clearTimeout(to));
    document.documentElement.addEventListener('touchend', () =>scrollFunct());
    document.documentElement.addEventListener('mouseup', () =>scrollFunct());
    document.documentElement.addEventListener('wheel', () =>scrollFunct());
};
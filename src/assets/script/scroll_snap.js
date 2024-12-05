const scrollSnap = (elQueryString) => {
    let to = null;
    let anim = null;
    let duration = 1000;
    let containerEl = document.querySelector(elQueryString);
    const height = containerEl.children[0].getBoundingClientRect().height;
    const scrollFunct = () => {
        to && clearTimeout(to);
        to = setTimeout(() => {
            const scrollTop = Math.round(containerEl.scrollTop / height) * height;
            anim && anime.remove('.dashboard');
            anim = anime({
                scrollTop,
                duration:100,
                targets: elQueryString,
                easing: 'easeInOutQuad'
            });
        }, duration);
    };
    document.documentElement.addEventListener('touchstart', ()=>clearTimeout(to));
    document.documentElement.addEventListener('mousedown', ()=>clearTimeout(to));
    document.documentElement.addEventListener('touchend', scrollFunct);
    document.documentElement.addEventListener('mouseup', scrollFunct);
    document.documentElement.addEventListener('wheel', scrollFunct);
};
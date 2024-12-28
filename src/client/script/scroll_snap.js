const scrollSnap = (containerEl) => {
    if (
        window.location.hash &&
        window.location.hash.startsWith('#scrollSnap-')
    ) {
        console.log('scrollSnap :: restore to', window.location.hash);
        containerEl.scrollTo({
            top: Number(window.location.hash.split('-')[1]),
            left: Number(window.location.hash.split('-')[2]),
        });
    }
    let to = null;
    containerEl.addEventListener('scroll', () => {
        if (to) clearTimeout(to);
        to = setTimeout(to => {
            window.location.hash = `scrollSnap-${containerEl.scrollTop}-${containerEl.scrollLeft}`;
        }, 333);
    });
};
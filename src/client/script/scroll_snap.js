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
    containerEl.addEventListener('scroll', debounceFunction(() => {
        window.location.hash = `scrollSnap-${containerEl.scrollTop}-${containerEl.scrollLeft}`;
    }, 333));
};
const scrollSnap = (containerEl) => {
    if (
        window.location.hash &&
        window.location.hash.startsWith('#scrollSnap-')
    ) {
        console.log('scrollSnap :: restore to', window.location.hash);
        containerEl.scrollTo(0, Number(window.location.hash.split('#scrollSnap-')[1]));
    }
    containerEl.addEventListener('scroll', debounceFunction(() => {
        window.location.hash = `scrollSnap-${containerEl.scrollTop}`;
    }, 333));
};
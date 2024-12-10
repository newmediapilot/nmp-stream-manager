const scrollSnap = (elQueryString) => {

    let containerEl = document.querySelector(elQueryString);
    let to = null;

    const scrollFunct = () => {
        // console.log('containerEl', containerEl);
    };

    // TODO: let's make things scroll-snap at some point!
    document.addEventListener('touchstart', () => clearTimeout(to));
    document.addEventListener('mousedown', () => clearTimeout(to));
    document.addEventListener('touchend', () => scrollFunct());
    document.addEventListener('mouseup', () => scrollFunct());
    document.addEventListener('wheel', () => scrollFunct());

    // Anchor remembers with debounce
    if (
        window.location.hash &&
        window.location.hash.startsWith('#scrollSnap-')
    ) {
        console.log('scrollSnap restore to ', window.location.hash);
        containerEl.scrollTo(0, Number(window.location.hash.split('#scrollSnap-')[1]));
    }

    containerEl.addEventListener('scroll', debounceFunction(() => {
        window.location.hash = `scrollSnap-${containerEl.scrollTop}`;
    }, 300));
};
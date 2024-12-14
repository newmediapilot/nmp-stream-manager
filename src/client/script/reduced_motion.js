const reducedMotion = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const reducedMotionEl = document.createElement('style');
        reducedMotionEl.setAttribute('data-reduced-motion', 'data-reduced-motion');
        document.head.insertBefore(reducedMotionEl, document.head.firstChild);
    }
    const prmEl = document.createElement('<style data-reduced-motion>');
    prmEl.innerHTML = "@media (prefers-reduced-motion: reduce) * { transition: none !important; animation: none !important; }";
    document.head.appendChild(prmEl);
};
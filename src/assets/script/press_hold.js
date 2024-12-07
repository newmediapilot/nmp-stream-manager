const detectPressHold = (onHoldDetected, onHoldReleased) => {

    let isHeldDown = false;
    let timeoutId = null;
    const debounceTime = 500;

    const onDown = () => {
        if (!isHeldDown) {
            isHeldDown = true;
        }
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            onHoldDetected();
        }, debounceTime);
    };

    const onUp = () => {
        isHeldDown = false;
        onHoldReleased();
        clearTimeout(timeoutId);
    };

    document.documentElement.addEventListener('mousedown', onDown);
    document.documentElement.addEventListener('touchstart', onDown);
    document.documentElement.addEventListener('mouseup', onUp);
    document.documentElement.addEventListener('touchend', onUp);

    console.log('detectPressHold', onHoldDetected, onHoldReleased);
};
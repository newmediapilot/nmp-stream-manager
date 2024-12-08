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

    document.addEventListener('mousedown', onDown);
    document.addEventListener('touchstart', onDown);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchend', onUp);

    console.log('detectPressHold', onHoldDetected, onHoldReleased);
};
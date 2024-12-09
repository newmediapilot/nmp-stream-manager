// When active we write mouseX mouse Y to global scope
const detectMouseCoordinates = () => {
    const updateXY = (e) => {
        const {clientX, clientY} = e;
        document.$clientX = clientX;
        document.$clientY = clientY;
    };
    document.addEventListener('mousemove', updateXY);
    document.addEventListener('mousedown', updateXY);
    document.addEventListener('mouseup', updateXY);
    document.addEventListener('touchstart', updateXY);
    document.addEventListener('touchend', updateXY);
    document.addEventListener('touch', updateXY);
    document.addEventListener('click', updateXY);
};
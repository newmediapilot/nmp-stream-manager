const detectMouseCoordinates = () => {
    const updateXY = (e) => {
        const {clientX, clientY} = e;
        document.$clientX = clientX;
        document.$clientY = clientY;
    };
    document.addEventListener('mousemove', (e) => updateXY(e));
    document.addEventListener('touch', (e) => updateXY(e));
    document.addEventListener('click', (e) => updateXY(e));
};
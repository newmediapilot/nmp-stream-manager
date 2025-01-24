const draw = () => {
    let capture = [];
    let payload = [];
    let buttonTimeout = null;
    const pixelSize = 20;
    const canvas = document.querySelector("canvas");
    canvas.width = canvas.getBoundingClientRect().width;
    canvas.height = canvas.getBoundingClientRect().height;
    const ctx = document.querySelector("canvas").getContext("2d");
    const clearCanvas = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        document.querySelector('input[type=range]').value = document.querySelector('input[type=range]').max;
        document.querySelector('[type=range]').value = 0;
        clearMemory();
    };
    const sendPayload = () => {
        replayStart();
        payload.length && axios.get(getPath("API_SIGNAL_CREATE"), {
            params: {
                type: "draw",
                description: payload.join(','),
            },
        });
    };
    const clearMemory = () => {
        capture = [];
        payload = [];
        if (buttonTimeout) clearTimeout(buttonTimeout);
        buttonTimeout = setTimeout(() => {
            document.querySelector('button:nth-of-type(1)').disabled = true;
            document.querySelector('button:nth-of-type(2)').disabled = false;
        }, 300);
    };
    const drawPixel = (x, y) => {
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-blue').trim();
        ctx.beginPath();
        ctx.arc(x, y, pixelSize / 2, 0, Math.PI * 2, false);
        ctx.fill();
        capture.push(Number(x/canvas.width).toFixed(3));
        payload.push(Number(x/canvas.width).toFixed(3));
        capture.push(Number(y/canvas.height).toFixed(3));
        payload.push(Number(y/canvas.height).toFixed(3));
        document.querySelector('[type=range]').value = capture.length;
        if (buttonTimeout) clearTimeout(buttonTimeout);
        buttonTimeout = setTimeout(() => {
            document.querySelector('button:nth-of-type(1)').disabled = false;
            document.querySelector('button:nth-of-type(2)').disabled = false;
        }, 300);
    };
    const replayStart = () => {
        if (Number(document.querySelector('[type=range]').value) > 0) {
            const x = capture.shift();
            const y = capture.shift();
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-aqua').trim();
            ctx.beginPath();
            ctx.arc(x, y, (pixelSize * 1.25) / 2, 0, Math.PI * 2, false);
            ctx.fill();
            document.querySelector('[type=range]').value = capture.length;
            document.querySelector('button:nth-of-type(1)').disabled = true;
            document.querySelector('button:nth-of-type(2)').disabled = true;
            requestAnimationFrame(replayStart);
            document.querySelectorAll('[aria-label]').forEach(() => {
                const {value, max} = document.querySelector('[type="range"]');
                const percent = Number(value) / Number(max);
                const deg = Math.round(percent * 1080);
                document.documentElement.style.setProperty('--range-rotation-deg', `${deg}deg`);
            });
        } else {
            clearMemory();
        }
    };
    const touchStartMove = (e) => {
        const {left, top} = document.querySelector('canvas').getBoundingClientRect();
        drawPixel(
            e.touches[0].pageX - left,
            e.touches[0].pageY - top,
        )
    };
    document.querySelector('canvas').addEventListener("touchstart", (e) => touchStartMove(e), {passive: true});
    document.querySelector('canvas').addEventListener("touchmove", (e) => touchStartMove(e), {passive: true});
    document.querySelector('section button:nth-of-type(1)').addEventListener('click', () => sendPayload());
    document.querySelector('section button:nth-of-type(2)').addEventListener('click', () => clearCanvas());
};
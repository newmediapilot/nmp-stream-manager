// Reads styles back and re-applies to interface
const applyStyleUpdates = () => {
    Array.from(document.querySelectorAll('.controls label'), (label) => {
        const payload = document.querySelector('#public_module_styles').innerHTML;
        const [formX, formY] = label.children;
        const nameX = formX.name;
        const nameY = formY.name;
        if (1 === payload.split(nameX).length) return;// must contain 'name' to be read
        const valueX = payload
            .split(nameX)[1]
            .split(':')[1]
            .split(';')[0];
        const valueY = payload
            .split(nameY)[1]
            .split(':')[1]
            .split(';')[0];
        const scrollTopPercent = (valueX - formX.min) / (formX.max - formX.min);
        const scrollLeftPercent = (valueY - formY.min) / (formY.max - formY.min);
        const {width, height} = label.getBoundingClientRect();
        const top = (scrollTopPercent) * (height);
        const left = (scrollLeftPercent) * (width);
        label.scrollTo({top, left});
    });
    setInterval(storeInputValues, 1000/120);
};
// Gathers scrollbar coordinates into forms and also iframe
const storeInputValues = () => {
    Array.from(document.querySelectorAll('.controls label')).forEach((label) => {
        const {width, height} = label.getBoundingClientRect();
        const lx = label.scrollLeft;
        const ly = label.scrollTop;
        const valueX = lx / (width / 2);
        const valueY = ly / (height / 2);
        const inputX = label.children[0];
        const inputY = label.children[1];
        inputX.value = inputX.max * valueX;
        inputY.value = inputY.max * valueY;
    });
    const payload = Array.from(document.querySelectorAll('input[type="range"]')).map((el) => {
        return `${el.name}:${el.value}`;
    }).join(";");
    document.querySelector('#public_module_styles').innerHTML = `:root{${payload};}`;
    document.querySelectorAll('iframe').forEach(iframe => {
        try {
            iframe && iframe.contentWindow && iframe.contentWindow.document.querySelectorAll('#public_module_styles').forEach(el => {
                el.innerHTML = `:root{${payload};}`
            });
        } catch (e) {
            // Sometimes if the frame is busy and we try
            // to style it, we will get a browser reload crash
        }
    });
    console.log('storeInputValues', payload);
};
// Simulates a joystick
const initializeInputForms = () => {
    const updateValues = () => {
        storeInputValues();
    };
    document.addEventListener('mousedown', (e) => {
        document.addEventListener('mousemove', updateValues);
    });
    document.addEventListener('mouseup', (e) => {
        document.removeEventListener('mousemove', updateValues);
        storeInputValues();
        sendInputValues();
    });
    document.addEventListener('touchmove', (e) => {
        storeInputValues();
    });
    document.addEventListener('touchend', (e) => {
        storeInputValues();
        sendInputValues();
    });
};

// Pushes the contents of all variables across all modules to write out
const sendInputValues = () => {
    let payload = document.querySelector('#public_module_styles')
        .innerHTML
        .replace(":root{", "")
        .replace(";}", "");
    payload && axios.get("/public/style/update", {
        params: {
            type: "style",
            payload
        },
    }).finally(() => {
        socketEmitReload();
    });
};
// Shows QR code for a given panel
const showPanelQR = (dialogQuerySelector, type) => {
    const dialogQuerySelectorCanvas = `${dialogQuerySelector} #qr-code-dialog-canvas`;
    const URL = document.querySelector(dialogQuerySelectorCanvas).getAttribute('data-url');
    showDialog(
        dialogQuerySelector,
        `🔗 ${type} Link`, `This link will open the ${type}<br>display on any device on your network.`
    );
    generateQrCode(
        URL,
        dialogQuerySelectorCanvas
    );
};
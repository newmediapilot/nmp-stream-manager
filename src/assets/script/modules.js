// Simulates a joystick
const renderMatrixStyle = () => {

    const setFocus = (label) => {
        const dragger = label.querySelector('input');
        const labelRect = label.getBoundingClientRect();
        const draggerRect = dragger.getBoundingClientRect();
        const top = (document.$clientY - labelRect.top - (draggerRect.height / 2));
        const left = (document.$clientX - labelRect.left - (draggerRect.width / 2));
        const lx = label.scrollLeft;
        const ly = label.scrollTop;
        const {width, height} = label.getBoundingClientRect();
        const percentageX = lx / (width / 2);
        const percentageY = ly / (height / 2);
        const inputX = label.children[0];
        const inputY = label.children[1];
        inputX.value = inputX.max * percentageX;
        inputY.value = inputY.max * percentageY;
        label.scrollTo(left, top);
    };
    // Touch devices don't requite the code below
    if (!detectIfTouchDevice()) {
        Array.from(document.querySelectorAll('.controls label')).forEach(label => {
            let isDragging = false;
            label.addEventListener('mousemove', (e) => {
                isDragging && renderStyleUpdates();
            });
            label.addEventListener('touchstart', (e) => {
                isDragging = true;
            });
            label.addEventListener('mousedown', (e) => {
                isDragging = true;
            });
            document.addEventListener('touchend', (e) => {
                isDragging = false;
                pushStyleUpdates();
            });
            document.addEventListener('mouseup', (e) => {
                isDragging = false;
                pushStyleUpdates();
            });
            const runAtFramerate = () => {
                isDragging && setFocus(label);
                requestAnimationFrame(runAtFramerate);
            };
            requestAnimationFrame(runAtFramerate);
        });
    }

};

// Realtime write of collected data into <style>
const renderStyleUpdates = () => {
    const payload = Array.from(document.querySelectorAll('input[type="range"]')).map(
        (el) => {
            return `${el.getAttribute('id')}:${el.value}${el.getAttribute('name')}`
        }
    ).join(";");
    document.querySelector('#public_module_styles').innerHTML = `:root { ${payload}; }`;
    document.querySelectorAll('iframe').forEach(iframe => {
        iframe.contentWindow.document.querySelector('#public_module_styles').innerHTML = `:root { ${payload}; }`;
    });
    return payload;
};

// Pushes the contents of all variables across all modules to write out
const pushStyleUpdates = () => {
    // Renders and also gets last collected values
    const payload = renderStyleUpdates();
    console.log('pushStyleUpdates', payload);
    payload && axios.get("/public/style/update", {
        params: {
            type: "style",
            payload
        },
    }).finally(() => {
        socketEmitReload();
    });
};

// Reads checkboxes and sets checked based on whether css contains their value
const applyStyleUpdates = () => {

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
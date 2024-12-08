// Simulates a joystick
const renderMatrixStyle = () => {
    // Touch device handling + default data handling


    if (detectIfTouchDevice()) return; // the rest of the code is for desktop device
    //////////////////////////////////////////////////////////////////////////////
    const setFocus = (label) => {
        const dragger = label.querySelector('input');
        const labelRect = label.getBoundingClientRect();
        const draggerRect = dragger.getBoundingClientRect();
        const top = (document.$clientY - labelRect.top - (draggerRect.height / 2));
        const left = (document.$clientX - labelRect.left - (draggerRect.width / 2));
        console.log('top', top);
        console.log('left', left);
        label.scrollTo(left, top);
    };
    Array.from(document.querySelectorAll('.controls label')).forEach(label => {
        let isDragging = false;
        label.addEventListener('touchstart', (e) => {
            isDragging = true;
        });
        label.addEventListener('mousedown', (e) => {
            isDragging = true;
        });
        document.addEventListener('touchend', (e) => {
            isDragging = false;
        });
        document.addEventListener('mouseup', (e) => {
            isDragging = false;
        });
        const runAtFramerate = () => {
            isDragging && setFocus(label);
            requestAnimationFrame(runAtFramerate);
        };
        requestAnimationFrame(runAtFramerate);
    });
};

// Realtime write of collected data into <style>
const renderStyleUpdates = () => {
    const payload = Array.from(document.querySelectorAll('input[type="range"]')).map(
        (el) => {
            return `${el.getAttribute('id')}:${el.value}${el.getAttribute('name')}`
        }
    ).join(";");
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
        console.log('pushStyleUpdates', payload);
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
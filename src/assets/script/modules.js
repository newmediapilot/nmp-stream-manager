// Pushes the contents of all variables across all modules to write out
const pushStyleUpdates = () => {
    // Assign attributes into a --variable format
    const payload = Array.from(document.querySelectorAll('input[type="range"]')).map(
        (el) => {
            return [
                el.getAttribute('id'),
                el.value,
                el.getAttribute('name')
            ].join("")
        }
    ).join("");
    document.querySelector('#public_module_styles').innerHTML = payload;
    console.log('pushStyleUpdates::payload', payload);
    payload && axios.get("/public/style/update", {
        params: {
            type: "style",
            payload
        },
    }).finally(() => {
        socketEmitReload();
        console.log('pushStyleUpdates::socketEmitReload');
    });
    applyStyleUpdates();
};

// Reads checkboxes and sets checked based on whether css contains their value
const applyStyleUpdates = () => {
    const styleString = document.querySelector('#public_module_styles');
    Array.from(document.querySelectorAll('input[type="range"]')).forEach(el => {
        el.checked = styleString.innerText.includes(el.value);
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
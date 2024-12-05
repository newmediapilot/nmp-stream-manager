// Pushes the contents of all variables across all modules to write out
const pushStyleUpdates = () => {
    const payload = Array.from(document.querySelectorAll('input[type="radio"]:checked')).map(el => el.value).join("");
    document.querySelector('#public_module_styles').innerHTML = payload;
    console.log('pushStyleUpdates::payload', payload);
    payload && axios.get("/public/style/update", {
        params: {
            type: "style",
            payload
        },
    })
        .finally(() => {
            socketEmitReload();
            console.log('pushStyleUpdates::socketEmitReload');
        });
};
// Reads checkboxes and sets checked based on whether css contains their value
const applyStyleUpdates = () => {
    const radioEls = Array.from(document.querySelectorAll('input[type="radio"]'));
    const styleString = document.querySelector('#public_module_styles');
    radioEls.forEach(el => {
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
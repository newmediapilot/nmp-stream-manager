// Simulates a joystick
const renderMatrixStyle = () => {
    const setFocus = () => {
        Array.from(document.querySelectorAll('.controls label')).forEach((label) => {
            const {width, height} = label.getBoundingClientRect();
            const lx = label.scrollLeft;
            const ly = label.scrollTop;
            const percentageX = lx / (width / 2);
            const percentageY = ly / (height / 2);
            const inputX = label.children[0];
            const inputY = label.children[1];
            inputX.value = inputX.max * percentageX;
            inputY.value = inputY.max * percentageY;
        });
    };
    // Gentle background refresh this state
    setInterval(() => {
        renderStyleUpdates();
        setFocus();
    }, 1000 / 60);
    document.addEventListener('touchend', (e) => {
        setFocus();
        pushStyleUpdates();
    });
    document.addEventListener('mouseup', (e) => {
        setFocus();
        pushStyleUpdates();
    });
};

// Realtime write of collected data into <style>
const renderStyleUpdates = () => {
    const payload = Array.from(document.querySelectorAll('input[type="range"]')).map(
        (el) => {
            return `${el.name}:${el.value}`;
        }
    ).join(";");
    document.querySelector('#public_module_styles').innerHTML = `:root { ${payload}; }`;
    document.querySelectorAll('iframe').forEach(iframe => {
        iframe.contentWindow.document.querySelectorAll('#public_module_styles').forEach(el => {
            el.innerHTML = `:root { ${payload}; }`
        })
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
        applyStyleUpdates();
    });
};

// Reads styles back and re-applies to interface
const applyStyleUpdates = () => {
    const payload = document.querySelector('#public_module_styles').innerHTML;

    Array.from(document.querySelectorAll('.controls label'), (label) => {
        const formX = label.children[0];
        const formY = label.children[1];
        const nameX = formX.name;
        const nameY = formY.name;
        const percentX = payload
            .split(nameX)[1]
            .split(':')[1]
            .split(';')[0];
        const percentY = payload
            .split(nameY)[1]
            .split(':')[1]
            .split(';')[0];
        console.log('percentX', percentX);
        console.log('percentY', percentY);
    });

    // Array.from(document.querySelectorAll('.controls label input')).forEach((input) => {
    //     const label = input.parentElement;
    //     const name = input.name;
    //     const value = payload
    //         .split(name)[1]
    //         .split(':')[1]
    //         .split(';')[0];
    //     const {width, height} = label.getBoundingClientRect();
    //     const scrollX = width * (value / 100);
    //     const scrollY = width * (value / 100);
    //     const percent = Number(value) * inputX.max;
    //     console.log('percent', percent);
    //     console.log('scrollX', scrollX);
    //     console.log('scrollY', scrollY);
    // });
    //
    //

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
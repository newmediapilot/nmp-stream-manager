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
};
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
        iframe && iframe.contentWindow && iframe.contentWindow.document.querySelectorAll('#public_module_styles').forEach(el => {
            el.innerHTML = `:root{${payload};}`
        });
    });
};
const initializeInputForms = () => {
    document.addEventListener('mousedown', (e) => {
        document.addEventListener('mousemove', storeInputValues);
        storeInputValues();
    });
    document.addEventListener('mouseup', (e) => {
        document.removeEventListener('mousemove', storeInputValues);
        storeInputValues();
    });
    document.addEventListener('touchmove', (e) => {
        document.addEventListener('mousemove', storeInputValues);
        storeInputValues();
    });
    document.addEventListener('touchend', (e) => {
        document.removeEventListener('mousemove', storeInputValues);
        storeInputValues();
    });
};
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
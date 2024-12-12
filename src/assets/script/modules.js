const applyModuleStyles = () => {
    Array.from(document.body.querySelectorAll('.controls label'), (label) => {
        const payload = document.head.querySelector('#public_module_styles').innerHTML;
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
const castModuleInputValues = () => {
    Array.from(document.body.querySelectorAll('.controls label')).forEach((label) => {
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
    const payload = Array.from(document.body.querySelectorAll('input[type="range"]')).map((el) => {
        return `${el.name}:${el.value}`;
    }).join(";");
    document.head.querySelector('#public_module_styles').innerHTML = `:root{${payload};}`;
    document.body.querySelectorAll('iframe').forEach(iframe => {
        try {
            iframe && iframe.contentWindow && iframe.contentWindow.document.head.querySelectorAll('#public_module_styles').forEach(el => {
                el.innerHTML = `:root{${payload};}`
            });
        } catch (e) {}
    });
};
const initializeModuleClickTouch = () => {
    document.addEventListener('mousedown', (e) => {
        document.addEventListener('mousemove', castModuleInputValues);
        castModuleInputValues();
    });
    document.addEventListener('mouseup', (e) => {
        document.removeEventListener('mousemove', castModuleInputValues);
        castModuleInputValues();
        sendInputValues();
    });
    document.addEventListener('touchmove', (e) => {
        document.addEventListener('mousemove', castModuleInputValues);
        castModuleInputValues();
    });
    document.addEventListener('touchend', (e) => {
        document.removeEventListener('mousemove', castModuleInputValues);
        castModuleInputValues();
        sendInputValues();
    });
};
const sendInputValues = () => {
    let payload = document.head.querySelector('#public_module_styles')
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
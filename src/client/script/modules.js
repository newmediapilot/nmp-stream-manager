const applyModuleStyles = () => {
    Array.from(document.body.querySelectorAll('.controls label')).forEach((label) => {
        const {scrollWidth, scrollHeight} = label;
        let payload = document.head.querySelector('#public_module_styles')
            .innerHTML
            .replace(":root{", "")
            .replace(";}", "")
            .split(';')
            .map(e => {
                const [name, value] = e.split(':');
                return {name, value}
            }).map(p => {
                return {
                    ...p,
                    value: Number(p.value)
                }
            }).filter(p => label.querySelector(`[name=${p.name}]`));
        console.log('applyModuleStyles :: payload', payload);
        label.scrollTo({
            top: scrollHeight / 4,
            left: scrollWidth / 4,
        });
    });
};
const castModuleInputValues = () => {
    Array.from(document.body.querySelectorAll('.controls label')).forEach((label) => {
        const [inputX, inputY] = [label.children[0], label.children[1]];
        const [px, py] = [label.scrollLeft / label.scrollWidth, label.scrollTop / label.scrollHeight];
        inputX.value = Number(inputX.min) + ((Math.abs(inputX.max) + Math.abs(inputX.min)) * px);
        inputY.value = Number(inputY.min) + ((Math.abs(inputY.max) + Math.abs(inputY.min)) * py);
    });
    const payload = Array.from(document.body.querySelectorAll('input[type="range"]')).map((el) => {
        return `${el.name}:${el.value}`;
    }).join(";");
    if (payload) document.head.querySelector('#public_module_styles').innerHTML = `:root{${payload};}`;
    payload && payload && axios.get("/api/signal/create", {
        params: {
            type: "style",
            description: payload,
        },
    });
};
const initializeModuleClickTouch = () => {
    document.addEventListener('mousedown', (e) => {
        document.addEventListener('mousemove', castModuleInputValues);
        castModuleInputValues();
    });
    document.addEventListener('mouseup', (e) => {
        document.removeEventListener('mousemove', castModuleInputValues);
        sendInputValues();
    });
    document.addEventListener('touchmove', (e) => {
        document.addEventListener('touchmove', castModuleInputValues);
        castModuleInputValues();
    });
    document.addEventListener('touchend', (e) => {
        document.removeEventListener('touchmove', castModuleInputValues);
        sendInputValues();
    });
};
const sendInputValues = () => {
    let payload = document.head.querySelector('#public_module_styles')
        .innerHTML
        .replace(":root{", "")
        .replace(";}", "");
    payload && axios.get("/api/style/update", {
        params: {
            type: "style",
            payload
        },
    }).finally(() => {
        socketEmitReload();
    });
};
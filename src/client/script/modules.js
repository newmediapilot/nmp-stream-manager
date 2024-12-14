const applyModuleStyles = () => {
    Array.from(document.body.querySelectorAll('.controls label')).forEach((label) => {
        const {width} = label.getBoundingClientRect();
        console.log('width', width);
        if (50 === width) label.scrollTo({top: 0, left: 0});
        if (100 === width) label.scrollTo({top: 0, left: 0});
        console.log('applyModuleStyles', label);
    });
    // const payload = document.head.querySelector('#public_module_styles').innerHTML;
    // const [formX, formY] = label.children;
    // const nameX = formX.name;
    // const nameY = formY.name;
    // if (1 === payload.split(nameX).length) return;// must contain 'name' to be read
    // const valueX = payload
    //     .split(nameX)[1]
    //     .split(':')[1]
    //     .split(';')[0];
    // const valueY = payload
    //     .split(nameY)[1]
    //     .split(':')[1]
    //     .split(';')[0];
    // const payload = document.head.querySelector('#public_module_styles').innerHTML
    //     .split(':root{')[1];
    // console.log('payload', payload);
    // const scrollTopPercent = (valueX - formX.min) / (formX.max - formX.min);
    // const scrollLeftPercent = (valueY - formY.min) / (formY.max - formY.min);
    // const {width, height} = label.getBoundingClientRect();
    // const top = (scrollTopPercent) * (height);
    // const left = (scrollLeftPercent) * (width);
    // label.scrollTo({top, left});
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
    if (payload) document.head.querySelector('#public_module_styles').innerHTML = `:root{${payload};}`;
    payload && payload && axios.get("/api/signal/create", {
        params: {
            type: "style",
            description: payload,
        },
    });
    console.log('/api/signal/create/payload', payload)
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
        document.addEventListener('touchmove', castModuleInputValues);
        castModuleInputValues();
    });
    document.addEventListener('touchend', (e) => {
        document.removeEventListener('touchmove', castModuleInputValues);
        castModuleInputValues();
        sendInputValues();
    });
};
const sendInputValues = () => {
    let payload = document.head.querySelector('#public_module_styles')
        .innerHTML
        .replace(":root{", "")
        .replace(";}", "");
    // TODO: Just use signal
    // payload && axios.get("/api/style/update", {
    //     params: {
    //         type: "style",
    //         payload
    //     },
    // }).finally(() => {
    //     // socketEmitReload();
    // });
};
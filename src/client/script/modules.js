const applyModuleStyles = () => {
    Array.from(document.body.querySelectorAll('.controls label')).forEach((label) => {
        const {scrollWidth, scrollHeight} = label;
        const payloadHTML = document.head.querySelector('#public_module_styles').innerHTML;
        if (payloadHTML.startsWith(":root{/*")) {
            label.scrollTo({
                top: scrollHeight / 4,
                left: scrollWidth / 4,
            });
            console.log('applyModuleStyles :: no payload');
            return;
        }
        let payload = payloadHTML
            .replace(":root{", "")
            .replace(";}", "")
            .split(';')
            .map(e => {
                const [name, value] = e.split(':');
                return {name, value}
            })
            .map(p => {
                return {
                    ...p,
                    value: Number(p.value)
                }
            })
            .filter(p => label.querySelector(`[name=${p.name}]`));
        console.log('payload', payload);
        const scrollX = payload[0].value ? payload[0].value / 100 : 0;
        const scrollY = payload[1].value ? payload[1].value / 100 : 0;
        label.scrollTo({
            left: scrollWidth * (scrollX / 2),
            top: scrollHeight * (scrollY / 2),
            behavior: 'smooth',
        });
    });
};
const castModuleInputValues = () => {
    Array.from(document.body.querySelectorAll('.controls label')).forEach((label) => {
        const [inputX, inputY] = [label.children[0], label.children[1]];
        const [px, py] = [label.scrollLeft / label.scrollWidth, label.scrollTop / label.scrollHeight];
        inputX.value = (Math.abs(inputX.max) * px);
        inputY.value = (Math.abs(inputY.max) * py);
    });
    const payload = Array.from(document.body.querySelectorAll('input[type="range"]')).map((el) => {
        return `${el.name}:${el.value}`;
    }).join(";");
    if (payload) document.head.querySelector('#public_module_styles').innerHTML = `:root{${payload};}`;
    payload && payload && axios.get(getPath("API_SIGNAL_CREATE"), {
        params: {
            type: "style",
            description: payload,
        },
    });
};
const initializeModuleClickTouch = () => {
    Array.from(document.body.querySelectorAll('.controls label')).forEach((label) => {
        label.addEventListener('mousedown', (e) => {
            label.addEventListener('mousemove', castModuleInputValues);
            castModuleInputValues();
        });
        label.addEventListener('mouseup', (e) => {
            label.removeEventListener('mousemove', castModuleInputValues);
            sendInputValues();
        });
        label.addEventListener('touchmove', (e) => {
            label.addEventListener('touchmove', castModuleInputValues);
            castModuleInputValues();
        });
        label.addEventListener('touchend', (e) => {
            label.removeEventListener('touchmove', castModuleInputValues);
            sendInputValues();
        });
    });
};
const sendInputValues = () => {
    let payload = document.head.querySelector('#public_module_styles')
        .innerHTML
        .replace(":root{", "")
        .replace(";}", "");
    payload && axios.get(getPath("API_STYLE_UPDATE"), {
        params: {
            type: "style",
            payload
        },
    }).finally(() => {
        // socketEmitReload();
    });
};
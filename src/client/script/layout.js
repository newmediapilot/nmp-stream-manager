const getPayloadValues = () => {
    return document.head.querySelector('#public_module_styles')
        .innerHTML.replace(":root{", "")
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
        });
};
const castLayoutInputValues = () => {
    const label = document.body.querySelector('.controls label');
    const {scrollWidth, scrollHeight} = label;
    const [layer, property] = document.$modes;
    const inputs = Array.from(label.children)
        .filter(input => input.name.includes(layer))
        .filter(input => {
            const ins = input.name.split('-').pop().substr(0, 1);
            const prp = property.substr(0, 1);
            return ins === prp;
        });
    console.log('inputs', inputs);
    const [inputX, inputY, inputZ] = [label.children[0], label.children[1]];
    const [px, py] = [(label.scrollLeft / scrollWidth) || 0, (label.scrollTop / scrollHeight) || 0];
    inputX.value = (Math.abs(inputX.max) * px);
    inputY.value = (Math.abs(inputY.max) * py);
    // if Z do something
    label.setAttribute('data-px-py', [px, py, label.scrollLeft, scrollWidth, label.scrollHeight, scrollHeight].join(' '));
    const payload = [
        ...Array.from(document.body.querySelectorAll('section .controls label input[type="range"]')).map(el => {
            return `${el.name}:${el.value}`;
        })
    ].join(";");
    document.head.querySelector('#public_module_styles').innerHTML = `:root{${payload};}`;
    payload && axios.get(getPath("API_SIGNAL_CREATE"), {
        params: {
            type: "style",
            description: payload,
        },
    });
};
const initializeLayoutClickTouch = () => {
    Array.from(document.body.querySelectorAll('.controls label')).forEach((label) => {
        label.addEventListener('mousedown', (e) => {
            label.addEventListener('mousemove', castLayoutInputValues);
            castLayoutInputValues();
        });
        label.addEventListener('mouseup', (e) => {
            label.removeEventListener('mousemove', castLayoutInputValues);
            sendLayoutInputValues();
        });
        label.addEventListener('touchstart', (e) => {
            label.addEventListener('touchmove', castLayoutInputValues, {passive: true});
            castLayoutInputValues();
        }, {passive: true});
        label.addEventListener('touchend', (e) => {
            label.removeEventListener('touchmove', castLayoutInputValues);
            sendLayoutInputValues();
        }, {passive: true});
    });
};
const enableLayerDragDrop = () => {
    new Sortable(document.body.querySelector("section article .layers"), {
        animation: 333,
        forceFallback: true,
        removeCloneOnHide: true,
        ghostClass: "pointer-events-none",
        onEnd: () => {
            castLayoutInputValues();
        },
    });
    document.body.querySelector("section .layers");
};
const sendLayoutInputValues = () => {
    let payload = document.head.querySelector('#public_module_styles')
        .innerHTML
        .replace(":root{", "")
        .replace(";}", "");
    payload && axios.get(getPath("API_STYLE_UPDATE"), {
        params: {
            type: "style",
            payload,
        },
    }).finally(() => {
        socketEmitReload();
    });
};
const setModes = () => {
    document.$layer = document.querySelector('article .layers input[type=radio]:checked').id;
    document.$mode = document.querySelector('article .modes input[type=radio]:checked').id;
    document.$modes = [document.$layer, document.$mode];
    console.log('setModes', document.$modes);
    // const {scrollWidth, scrollHeight} = document.querySelector('article .controls label');
    // const [x, y] = getPayloadValues();
    // const top = scrollHeight * (y.value / 200);
    // const left = scrollWidth * (x.value / 200);
    // document.querySelector('article .controls label').scrollTo({
    //     top,
    //     left,
    //     behavior: "smooth",
    // });
};
const enableRadioButtons = () => {
    Array.from(
        [
            ...document.body.querySelectorAll('article .modes input'),
            ...document.body.querySelectorAll('article .layers input'),
        ]
    ).forEach(input => input.addEventListener('change', setModes));
    document.querySelector('article .layers input[type=radio]:nth-of-type(1)').checked = true;
    document.querySelector('article .modes input[type=radio]:nth-of-type(1)').checked = true;
    setModes();
};
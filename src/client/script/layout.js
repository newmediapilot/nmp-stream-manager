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
    const [inputX, inputY, inputZ] = Array.from(label.children)
        .filter(input => input.name.includes(layer))
        .filter(input => {
            const prop = input.name.split('-').pop().substr(0, 1);
            return property.substr(0, 1) === prop;
        });
    const [px, py] = [(label.scrollLeft / scrollWidth) || 0, (label.scrollTop / scrollHeight) || 0];
    inputX.value = (Math.abs(inputX.max) * px);
    inputY.value = (Math.abs(inputY.max) * py);
    inputX.setAttribute("value", (Math.abs(inputX.max) * px));
    inputY.setAttribute("value", (Math.abs(inputY.max) * py));
    if (inputZ) {
        console.log('inputZ', inputZ);
    }
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
            setModes();
        });
        label.addEventListener('touchstart', (e) => {
            label.addEventListener('touchmove', castLayoutInputValues, {passive: true});
            castLayoutInputValues();
        }, {passive: true});
        label.addEventListener('touchend', (e) => {
            label.removeEventListener('touchmove', castLayoutInputValues);
            sendLayoutInputValues();
            setModes();
        }, {passive: true});
    });
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
    });
};
const setModes = () => {
    document.$modes = [
        document.querySelector('article .layers input[type=radio]:checked').id,
        document.querySelector('article .modes input[type=radio]:checked').id
    ];
    getPayloadValues().forEach(({name, value}) => {
        document.querySelectorAll(`[name=${name}]`).forEach(input => {
            input.value = value;
            input.setAttribute('value', value);
        });
    });
    const controlValues = getPayloadValues()
        .filter(({name}) => name.includes(document.$modes[0]))
        .filter(({name}) => {
            const mode = document.$modes[1].substr(0, 1);
            const prop = name.split('-').pop().substr(0, 1);
            return mode === prop;
        });
    const [x, y] = controlValues;
    const {scrollWidth, scrollHeight} = document.querySelector('article .controls label');
    const top = scrollHeight * (y.value / 200);
    const left = scrollWidth * (x.value / 200);
    document.querySelector('article .controls label').scrollTo({
        top,
        left,
        behavior: "smooth",
    });
    document.querySelector('article .controls').setAttribute('id', document.$modes[1]);
    document.querySelectorAll('.preview iframe').forEach((iframe) => {
        if (iframe.name === document.$modes[0]) {
            iframe.contentDocument.documentElement.classList.remove('deselected');
            iframe.contentDocument.documentElement.classList.add('selected');
        } else {
            iframe.contentDocument.documentElement.classList.remove('selected');
            iframe.contentDocument.documentElement.classList.add('deselected');
        }
    })
};
const enableUndoButton = () => {
    document.querySelector('article .effects button:nth-of-type(1)').addEventListener('click', () => {
        document.body.querySelector('#qr-dialog').showModal();
    });
    document.querySelector('article .effects button:nth-of-type(2)').addEventListener('click', () => {
        const {scrollWidth, scrollHeight} = document.querySelector('article .controls label');
        const top = scrollHeight * .25;
        const left = scrollWidth * .25;
        document.querySelector('article .controls label').scrollTo({
            top,
            left,
        });
        castLayoutInputValues();
    });
};
const enableRadioButtons = () => {
    Array.from(
        [
            ...document.body.querySelectorAll('article .modes input'),
            ...document.body.querySelectorAll('article .layers input'),
        ]
    ).forEach(input => input.addEventListener('change', setModes));
    enableUndoButton();
    document.querySelector('article .layers input[type=radio]:nth-of-type(1)').checked = true;
    document.querySelector('article .modes input[type=radio]:nth-of-type(1)').checked = true;
};
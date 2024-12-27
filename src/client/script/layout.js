const applyLayoutStyles = () => {

};
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
    Array.from(document.body.querySelectorAll('.controls label')).forEach((label) => {
        const {scrollWidth, scrollHeight} = label;
        const [inputX, inputY] = [label.children[0], label.children[1]];
        const [px, py] = [(label.scrollLeft / scrollWidth) || 0, (label.scrollTop / scrollHeight) || 0];
        inputX.value = (Math.abs(inputX.max) * px);
        inputY.value = (Math.abs(inputY.max) * py);
        label.setAttribute('data-px-py', [px, py, label.scrollLeft, scrollWidth, label.scrollHeight, scrollHeight].join(' '))
    });
    const payload = [
        ...Array.from(document.body.querySelectorAll('section .controls label input[type="range"]')).map(el => {
            return `${el.name}:${el.value}`;
        }),
        ...Array.from(document.body.querySelectorAll('section .layers label input[type="radio"]')).map((el, index, arr) => {
            return `${el.id}:${arr.length - index - 1}`;
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
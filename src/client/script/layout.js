const applyLayoutStyles = () => {
    Array.from(document.body.querySelectorAll('.controls label')).forEach((label) => {
        const {scrollWidth, scrollHeight} = label;
        const payloadHTML = document.head.querySelector('#public_module_styles').innerHTML;
        if (payloadHTML.startsWith(":root{/*")) {
            label.scrollTo({
                top: scrollHeight / 4,
                left: scrollWidth / 4,
            });
            console.log('applyLayoutStyles :: no payload');
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
        const scrollX = payload[0].value ? payload[0].value / 100 : 0;
        const scrollY = payload[1].value ? payload[1].value / 100 : 0;
        label.scrollTo({
            left: scrollWidth * (scrollX / 2),
            top: scrollHeight * (scrollY / 2),
            behavior: 'smooth',
        });
    });
    Array.from(document.body.querySelectorAll('.layers')).forEach((layer) => {
        const payloadHTML = document.head.querySelector('#public_module_styles').innerHTML;
        if (payloadHTML.startsWith(":root{/*")) {
            return;
        }
        let payload = payloadHTML
            .replace(":root{", "")
            .replace(";}", "")
            .split(';')
            .map(e => e.split(':'))
            .map(([key, value]) => {
                return {
                    el: layer.querySelector(`label[for="${String(key)}"]`),
                    key: String(key),
                    value: Number(value),
                }
            }).filter(({el}) => !!el)
            .map((data) => {
                const {el, value} = data;

                return data;
            });
        console.log('payload', payload);
    });
};
const castLayoutInputValues = () => {
    Array.from(document.body.querySelectorAll('.controls label')).forEach((label) => {
        const [inputX, inputY] = [label.children[0], label.children[1]];
        const [px, py] = [(label.scrollLeft / label.scrollWidth) || 0, (label.scrollTop / label.scrollHeight) || 0];
        inputX.value = (Math.abs(inputX.max) * px);
        inputY.value = (Math.abs(inputY.max) * py);
        label.setAttribute('data-px-py', [px, py].join(' '))
    });
    const payload = [
        ...Array.from(document.body.querySelectorAll('section .controls label input[type="range"]')).map(el => {
            return `${el.name}:${el.value}`;
        }),
        ...Array.from(document.body.querySelectorAll('section .layers label input[type="radio"]')).map((el, index, arr) => {
            return `${el.id}:${arr.length - index - 1}`;
        })
    ].join(";");
    if (payload) document.head.querySelector('#public_module_styles').innerHTML = `:root{${payload};}`;
    payload && payload && axios.get(getPath("API_SIGNAL_CREATE"), {
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
            payload
        },
    }).finally(() => {
        socketEmitReload();
    });
};
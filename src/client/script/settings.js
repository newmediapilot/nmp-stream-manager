const settingsCreateEmojiWidget = (editorEl) => {
    const {id} = editorEl;
    const emojiWidgetEl = document.body.querySelector("#emoji-widget");
    const emojiWidgetTriggerEl = editorEl.querySelector("button:nth-of-type(1)");
    let emojiWidgetInstanceEl;
    emojiWidgetTriggerEl.addEventListener("click", (e) => {
        document.body.querySelectorAll('.emoji-widget-instance').forEach(el => el.remove());
        document.body.querySelectorAll('.emoji-widget-instance-trigger').forEach(el => el.classList.remove('emoji-widget-instance-trigger'));
        emojiWidgetTriggerEl.classList.remove("add");
        if (emojiWidgetInstanceEl) {
            emojiWidgetInstanceEl = null;
        } else {
            emojiWidgetInstanceEl = emojiWidgetEl.cloneNode(true);
            emojiWidgetInstanceEl.classList.add('emoji-widget-instance');
            emojiWidgetTriggerEl.classList.add("emoji-widget-instance-trigger");
            editorEl.insertAdjacentElement("afterend", emojiWidgetInstanceEl);
            const emojiEls = emojiWidgetInstanceEl.querySelectorAll("li");
            const emojiElsClick = (evt) => {
                emojiEls.forEach(
                    (el) => {
                        (emojiWidgetTriggerEl.getAttribute("aria-label") === el.getAttribute("aria-label")) ?
                            el.classList.add("active") :
                            el.classList.remove("active");
                    }
                );
            };
            emojiEls.forEach((el) => {
                el.addEventListener("click", (evt) => {
                    emojiWidgetTriggerEl.setAttribute("aria-label", el.getAttribute("aria-label"));
                    emojiElsClick();
                    axios.get("/api/config/update", {
                        params: {
                            type: "signals:field",
                            payload: JSON.stringify({
                                id,
                                field: "emoji",
                                value: el.getAttribute("aria-label"),
                            }),
                        },
                    }).finally(() => {
                        socketEmitReload();
                    });
                });
            });
        }
        emojiWidgetTriggerEl.scrollIntoView({
            behavior: 'smooth'
        });
    });
};

const settingsCreateEditor = (editorEl) => {
    const {id} = editorEl;
    const textInputEls = editorEl.querySelectorAll('[type="text"], textarea');
    const textInputElFocus = (textInputEl) => {
        textInputEl.$value = textInputEl.value;
        textInputEl.select();
        textInputEl.scrollIntoView({
            behavior: 'smooth'
        });
    };
    const textInputElBlur = (textInputEl) => {
        if (
            textInputEl.$value !== textInputEl.value &&
            textInputEl.value.trim().length > 2 &&
            textInputEl.value.trim().length <= 25
        ) {
            const field = (textInputEl.tagName.toLowerCase() === 'input') ?
                'label' :
                'description';
            axios
                .get("/api/config/update", {
                    params: {
                        type: "signals:field",
                        payload: JSON.stringify({
                            id,
                            field,
                            value: textInputEl.value,
                        }),
                    },
                })
                .finally(() => socketEmitReload());
        }
        textInputEl.disabled = true;
        setTimeout(() => {
            textInputEl.disabled = false;
        }, 1000);
    };
    textInputEls.forEach((textInputEl) => {
        textInputEl.addEventListener("focus", ({target}) => textInputElFocus(target));
        textInputEl.addEventListener("blur", ({target}) => textInputElBlur(target));
        textInputEl.addEventListener("keydown", ({target}) => (event.keyCode === 13) && textInputElBlur(target));
    });
};

const settingsCreateUploader = (editorEl) => {
    const {id} = editorEl;
    const uploadButton = editorEl.querySelector('button:nth-of-type(2)');
    const replayButton = editorEl.querySelector('button:nth-of-type(3)');
    if (!!uploadButton && !!replayButton) {
        uploadButton.addEventListener('click', () => {
            console.log('upload', id);
        });
        replayButton.addEventListener('click', () => {
            console.log('replay', id);
        });
    }
};

const settings = () => {
    document.body.querySelectorAll("section ul li:not([aria-label]) label").forEach(settingsCreateEditor);
    document.body.querySelectorAll("section ul li:not([aria-label]) label").forEach(settingsCreateEmojiWidget);
    document.body.querySelectorAll("section ul li:not([aria-label]) label").forEach(settingsCreateUploader);
};
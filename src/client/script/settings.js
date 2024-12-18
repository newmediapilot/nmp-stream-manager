const settingsCreateEmojiWidget = (editorEl) => {
    const {id} = editorEl;
    const emojiWidgetEl = document.body.querySelector("#emoji-widget");
    const emojiWidgetTriggerEl = editorEl.querySelector("button:nth-of-type(1)");
    let emojiWidgetInstanceEl;
    emojiWidgetTriggerEl.addEventListener("click", () => {
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
            const emojiElsClick = () => {
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
                'cells';
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
    let audio = null;
    const uploadButton = editorEl.querySelector('button:nth-of-type(2)');
    const replayButton = editorEl.querySelector('button:nth-of-type(3)');
    const inputEl = editorEl.querySelector('input[type=text]');
    if (!!inputEl && !!uploadButton && !!replayButton) {
        const togglePlayDisabled = () => {
            // const url = `/.media/${uploadButton.id}?${new Date().getTime()}`;
            // console.log('togglePlayDisabled :: checking ::', url);
            // axios.get(url).then(() => {
            //     if (audio) {
            //         audio = undefined;
            //     }
            //     audio = new Audio(url);
            //     audio.volume = 0.75;
            //     replayButton.disabled = false;
            // }).catch(error => {
            //         console.log('togglePlayDisabled :: no sound ::', url);
            //         replayButton.disabled = true;
            //     }
            // );
        };
        togglePlayDisabled();
        const clickReplayButton = () => {
            // console.log('(audio.currentTime', (audio.currentTime));
            // console.log('(audio.duration', (audio.duration));
            // if (audio.currentTime > 0) {
            //     audio.pause();
            //     audio.currentTime = 0;
            // } else {
            //     audio.play();
            // }
        };
        const clickUploadButton = () => {
            const cells = uploadButton.id.split(',')
            const id = cells[0];
            let fileType = cells[1];
            const fileAcceptList = cells.slice(1).map(f => `${fileType}/${f}`).slice(1).join(', ');
            const uploader = document.createElement('input');
            uploader.type = 'file';
            uploader.accept = fileAcceptList;
            uploader.addEventListener('change', function () {
                if (uploader.files[0]) {
                    const reader = new FileReader();
                    inputEl.focus();
                    reader.onloadend = () => {
                        const type = uploader.files[0].name.split('.').pop();
                        uploadButton.id = cells
                        axios.post("/api/media/update",
                            {
                                data: reader.result.split(',')[1],
                                id,
                                type,
                            }).then(response => {
                            console.log('settingsCreateUploader :: success:', response.data);
                            togglePlayDisabled();
                        }).catch(error => {
                            console.error('settingsCreateUploader :: error:', error);
                        });
                    };
                    reader.readAsDataURL(uploader.files[0]);
                }
                uploader.remove();
            });
            uploader.click();
        };
        replayButton.addEventListener('click', clickReplayButton);
        uploadButton.addEventListener('click', clickUploadButton);
    }
};

const settingsToggler = (editorEl) => {
    const {id} = editorEl;
    const toggleButton = editorEl.querySelector('button:nth-of-type(4)');
    if (!!toggleButton) {
        const sendToggleState = () => {
            toggleButton.disabled = true;
            let state = toggleButton.getAttribute('aria-label');
            if (state === "ON") {
                state = "OFF";
            } else if (state === "OFF") {
                state = "ON";
            }
            toggleButton.setAttribute('aria-label', state);
            axios.get("/api/config/update", {
                params: {
                    type: "signals:field",
                    payload: JSON.stringify({
                        id,
                        field: "visibility",
                        value: state,
                    }),
                },
            }).finally(() => {
                toggleButton.disabled = false;
                socketEmitReload();
            });
        };
        toggleButton.addEventListener('click', sendToggleState);
    }
};

const settings = () => {
    document.body.querySelectorAll("section ul li:not([aria-label]) label").forEach(settingsCreateEditor);
    document.body.querySelectorAll("section ul li:not([aria-label]) label").forEach(settingsCreateEmojiWidget);
    document.body.querySelectorAll("section ul li:not([aria-label]) label").forEach(settingsCreateUploader);
    document.body.querySelectorAll("section ul li:not([aria-label]) label").forEach(settingsToggler);
};
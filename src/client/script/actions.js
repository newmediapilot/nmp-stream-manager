const actionsCreateEmojis = (editorEl) => {
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
                    axios.get(getPath("API_CONFIG_UPDATE"), {
                        params: {
                            type: "signals:field",
                            payload: JSON.stringify({
                                id: editorEl.id,
                                field: "emoji",
                                value: el.getAttribute("aria-label"),
                            }),
                        },
                    });
                });
            });
        }
        emojiWidgetTriggerEl.scrollIntoView({
            behavior: 'smooth'
        });
    });
};

const actionsCreateEditor = (editorEl) => {
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
                .get(getPath('API_CONFIG_UPDATE'), {
                    params: {
                        type: "signals:field",
                        payload: JSON.stringify({
                            id: editorEl.id,
                            field,
                            value: textInputEl.value,
                        }),
                    },
                });
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

const actionsCreateUpload = (editorEl) => {
    let buster = new Date().getTime();
    const id = editorEl.id;
    const uploadButton = editorEl.querySelector('button:nth-of-type(2):not(:disabled)');
    const actionButton = editorEl.querySelector('button:nth-of-type(3):not(:disabled)');
    const imageElement = editorEl.querySelector('img');
    const inputEl = editorEl.querySelector('[type="text"]');
    const toggleReplayState = () => {
        const cells = uploadButton.id.split(',');
        const url = `https://api.dbdbdbdbdbgroup.com/demo/media/${cells[0]}.${cells[2]}?${cells[1]}=${buster}`;
        console.log('toggleReplayState :: checking ::', url);
        axios.get(url).then(() => {
                actionButton.disabled = false;
        }).catch(() => {
                console.log('toggleReplayState :: no sound ::', url);
                actionButton.disabled = true;
            }
        );
    };
    if (!!uploadButton) {
        const clickUploadButton = () => {
            const cells = uploadButton.id.split(',')
            const uploader = document.createElement('input');
            uploader.type = 'file';
            uploader.accept = cells.slice(1).map(suffix => `${cells[1]}/${suffix}`).slice(1).join(', ');
            uploader.addEventListener('change', () => {
                if (uploader.files[0]) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        console.log('actionsCreateUpload :: file loaded');
                        const type = uploader.files[0].name.split('.').pop();
                        const acceptTypes = cells.slice(2);
                        const newCells = `${cells[0]},${cells[1]},${type},${acceptTypes.filter(t => t !== type).join(',')}`;
                        uploadButton.setAttribute("id", newCells);
                        axios.post(getPath("API_MEDIA_UPDATE"),
                            {
                                data: reader.result.split(',')[1],
                                key: cells[0],
                                type,
                                id,
                            }).then(response => {
                            actionButton && toggleReplayState();
                            inputEl.focus();
                            setFocusToken();
                            console.log('actionsCreateUpload :: success:', response.data);
                        }).catch(error => {
                            console.error('actionsCreateUpload :: error:', error);
                        })
                    };
                    reader.readAsDataURL(uploader.files[0]);
                    buster = new Date().getTime();
                }
                uploader.remove();
            });
            uploader.click();
        };
        uploadButton.addEventListener('click', clickUploadButton);
    }
    if (!!actionButton) {
        toggleReplayState();
        const cells = uploadButton.id.split(',');
        const type = cells[1];
        const playAudio = () => {
            const cells = uploadButton.id.split(',');
            const url = `https://api.dbdbdbdbdbgroup.com/demo/media/${cells[0]}.${cells[2]}?${cells[1]}=${buster}`;
            document.$audio && document.$audio.pause();
            document.$audio = new Audio(url);
            document.$audio.play();
            console.log('playAudio :: ', url);
        };
        const displayMedia = () => {
            if (!imageElement.src) {
                const cells = uploadButton.id.split(',');
                const url = `https://api.dbdbdbdbdbgroup.com/demo/media/${cells[0]}.${cells[2]}?${cells[1]}=${buster}`;
                imageElement.src = url;
                editorEl.style.gridTemplateRows = `repeat(3, 100px)`;
                editorEl.scrollIntoView({
                    behavior: 'smooth'
                });
            } else {
                imageElement.removeAttribute('src');
                editorEl.style.gridTemplateRows = `repeat(3, 25px)`;
            }
        };
        actionButton.addEventListener('click', () => {
            "audio" === type && playAudio();
            "image" === type && displayMedia();
        });
    }
};

const actionsToggle = (editorEl) => {
    const toggleButton = editorEl.querySelector('button:nth-of-type(4)');
    const updateButtons = () => {
        let state = toggleButton.getAttribute('aria-label');
        editorEl.querySelectorAll('button:not([readonly]), input:not([readonly]), textarea:not([readonly])').forEach((el) => {
            if (el !== toggleButton) {
                if (state === "ON") {
                    el.disabled = false;
                } else if (state === "OFF") {
                    el.disabled = true;
                }
            }
        });
    };
    const sendToggleState = () => {
        toggleButton.disabled = true;
        let state = toggleButton.getAttribute('aria-label');
        if (state === "ON") {
            state = "OFF";
        } else if (state === "OFF") {
            state = "ON";
        }
        toggleButton.setAttribute('aria-label', state);
        axios.get(getPath("API_CONFIG_UPDATE"), {
            params: {
                type: "signals:field",
                payload: JSON.stringify({
                    id: editorEl.id,
                    field: "visibility",
                    value: state,
                }),
            },
        }).then(() => {
            updateButtons();
            toggleButton.setAttribute('aria-label', state);
        }).finally(() => {
            toggleButton.disabled = false;
        });
    };
    toggleButton.addEventListener('click', sendToggleState);
    updateButtons();
};

const actions = () => {
    const bodyEl = document.body.querySelector("section");
    const innerHTML = bodyEl.innerHTML;
    bodyEl.innerHTML = "";
    bodyEl.innerHTML = innerHTML;
    document.body.querySelectorAll("section > div:not([aria-label]) label").forEach(actionsCreateEditor);
    document.body.querySelectorAll("section > div:not([aria-label]) label").forEach(actionsCreateEmojis);
    document.body.querySelectorAll("section > div:not([aria-label]) label").forEach(actionsCreateUpload);
    document.body.querySelectorAll("section > div:not([aria-label]) label").forEach(actionsToggle);
};
const settingsCreateEmojis = (editorEl) => {
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

const settingsCreateUpload = (editorEl) => {
    let audio = null;
    const id = editorEl.id;
    const uploadButton = editorEl.querySelector('button:nth-of-type(2):not(:disabled)');
    const actionButton = editorEl.querySelector('button:nth-of-type(3):not(:disabled)');
    const inputEl = editorEl.querySelector('[type="text"]');
    const toggleReplayState = () => {
        const cells = uploadButton.id.split(',');
        const url = `/.media/${cells[0]}.${cells[2]}?${cells[1]}=${new Date().getTime()}`;
        console.log('toggleReplayState :: checking ::', url);
        axios.get(url).then(() => {
            if (audio) {
                audio = undefined;
            }
            audio = new Audio(url);
            audio.volume = 0.75;
            audio.addEventListener('timeupdate', () => {
                if (audio.currentTime > 0) {
                    const value = (audio.currentTime / audio.duration) * 360;
                    editorEl.querySelector('button:nth-of-type(3)').style.transform = `rotateZ(${value}deg)`;
                }
                if(audio.currentTime >= audio.duration) {
                    audio.currentTime = 0;
                    audio.pause();
                }
            });
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
                        const type = uploader.files[0].name.split('.').pop();
                        const acceptTypes = cells.slice(2);
                        const newCells = `${cells[0]},${cells[1]},${type},${acceptTypes.filter(t => t !== type).join(',')}`;
                        axios.post("/api/media/update",
                            {
                                data: reader.result.split(',')[1],
                                key: cells[0],
                                type,
                                id,
                            }).then(response => {
                            uploadButton.setAttribute("id", newCells);
                            actionButton && toggleReplayState();
                            inputEl.focus();
                            console.log('settingsCreateUpload :: success:', response.data);
                        }).catch(error => {
                            console.error('settingsCreateUpload :: error:', error);
                        })
                    };
                    reader.readAsDataURL(uploader.files[0]);
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
        const replayAudio = () => {
            console.log('replayAudio :: currentTime ::', audio.currentTime);
            if (audio.currentTime > 0) {
                audio.pause();
                audio.currentTime = 0;
            } else {
                audio.play();
            }
        };
        const displayMedia = () => {
            console.log('displayMedia :: displayMedia ::');
        };
        actionButton.addEventListener('click', () => {
            "audio" === type && replayAudio();
            "image" === type && displayMedia();
        });
    }
};

const settingsToggle = (editorEl) => {
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
    document.body.querySelectorAll("section ul li:not([aria-label]) label").forEach(settingsCreateEmojis);
    document.body.querySelectorAll("section ul li:not([aria-label]) label").forEach(settingsCreateUpload);
    document.body.querySelectorAll("section ul li:not([aria-label]) label").forEach(settingsToggle);
};
const settingsCreateEditor = (editorEl) => {
    const id = editorEl.getAttribute("data-editor-id");
    const textInputEl = editorEl.querySelector('[type="text"]');
    const emojiWidgetTriggerEl = editorEl.querySelector("button");
    const emojiWidgetEl = document.body.querySelector("#emoji-widget");
    let emojiWidgetInstanceEl;
    let textEditorValue = null;
    const textInputElFocus = () => {
        textEditorValue = textInputEl.value;
        textInputEl.select();
        textInputEl.scrollIntoView({
            behavior: 'smooth'
        });
    };
    const textInputElBlur = () => {
        if (
            textInputEl.value !== textEditorValue &&
            textInputEl.value.trim().length > 2 &&
            textInputEl.value.trim().length <= 25 // Twitch max
        ) {
            axios
                .get("/public/config/update", {
                    params: {
                        type: "signals:field",
                        payload: JSON.stringify({
                            id,
                            field: "label",
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
    textInputEl.addEventListener("focus", textInputElFocus);
    textInputEl.addEventListener("blur", textInputElBlur);
    textInputEl.addEventListener(
        "keydown",
        () => event.keyCode === 13 && textInputElBlur(),
    );
    emojiWidgetTriggerEl.addEventListener("click", () => {
        // cleanup anything existing first
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
                    axios.get("/public/config/update", {
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
    });
}

const settings = () => {
    document.body.querySelectorAll('form').forEach((form) => {
        form.addEventListener('submit', (e) => {
            console.log('form');
            e.preventDefault()
        });
    });
    document.body.querySelectorAll("form").forEach(settingsCreateEditor);
};
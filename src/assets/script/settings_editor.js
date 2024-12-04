const initSettingsEditor = (editorEl) => {
    const id = editorEl.getAttribute("data-editor-id");
    const textEditorEl = editorEl.querySelector('[type="text"]');
    const emojiWidgetTriggerEl = editorEl.querySelector("button");
    const emojiWidgetEl = document.querySelector("#emoji-widget");
    let emojiWidgetInstanceEl;

    let textEditorValue = null;

    const textEditorElFocus = () => {
        textEditorValue = textEditorEl.value;
        textEditorEl.select();
        textEditorEl.scrollTo();
    };

    const textEditorElBlur = () => {
        if (
            textEditorEl.value !== textEditorValue &&
            textEditorEl.value.trim().length > 2 &&
            textEditorEl.value.trim().length <= 25 // Twitch max
        ) {
            const payload = {
                id,
                field: "label",
                value: textEditorEl.value,
            };
            axios
                .get("/public/config/update", {
                    params: {
                        type: "signals:field",
                        payload: JSON.stringify(payload),
                    },
                })
                .finally(() => socketEmitReload());
        }
        textEditorEl.disabled = true;
        setTimeout(() => {
            textEditorEl.disabled = false;
        }, 1000);
    };

    textEditorEl.addEventListener("focus", textEditorElFocus);
    textEditorEl.addEventListener("blur", textEditorElBlur);
    textEditorEl.addEventListener(
        "keydown",
        () => event.keyCode === 13 && textEditorElBlur(),
    );

    emojiWidgetTriggerEl.addEventListener("click", () => {
        if (emojiWidgetInstanceEl) {
            emojiWidgetInstanceEl.remove();
            emojiWidgetInstanceEl = null;
        } else {
            emojiWidgetInstanceEl = emojiWidgetEl.cloneNode(true);
            editorEl.insertAdjacentElement("afterend", emojiWidgetInstanceEl);

            const emojiEls = emojiWidgetInstanceEl.querySelectorAll("li");

            emojiEls.forEach(
                (el) =>
                    emojiWidgetTriggerEl.innerText === el.innerText &&
                    el.classList.add("active"),
            );

            emojiEls.forEach((el) => {
                el.addEventListener("click", () => {
                    const payload = {
                        id,
                        field: "emoji",
                        value: el.innerText,
                    };
                    axios
                        .get("/public/config/update", {
                            params: {
                                type: "signals:field",
                                payload: JSON.stringify(payload),
                            },
                        })
                        .finally(() => socketEmitReload());
                });
            });
        }
    });
};
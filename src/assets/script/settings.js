const settings = () => {
    const editorEl = document.querySelectorAll(".settings-editor");
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

        // cleanup anything existing first
        document.querySelectorAll('.emoji-widget-instance')
            .forEach(el => el.remove());
        document.querySelectorAll('.emoji-widget-instance-trigger')
            .forEach(el => el.classList.remove('emoji-widget-instance-trigger'));
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
                        (emojiWidgetTriggerEl.innerText === el.innerText) ?
                            el.classList.add("active") :
                            el.classList.remove("active");
                    }
                );
            };
            emojiElsClick();
            emojiEls.forEach((el) => {
                el.addEventListener("click", () => {
                    emojiElsClick();
                });
                el.addEventListener("click", (evt) => {
                    emojiWidgetTriggerEl.innerText = el.innerText;
                    emojiElsClick();
                    const payload = {
                        id,
                        field: "emoji",
                        value: el.innerText,
                    };
                    axios.get("/public/config/update", {
                        params: {
                            type: "signals:field",
                            payload: JSON.stringify(payload),
                        },
                    }).finally(() => {
                        // socketEmitReload();
                    });
                });
            });
        }
    });
};
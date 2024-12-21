const dashboard = () => {
    let payload = [];
    const type = "signals:order";
    const containerEl = document.body.querySelector("section");
    const toggleEl = document.body.querySelector("#toggle-edit-dashboard");
    const notifyEl = document.documentElement;
    const states = [
        `<span aria-label="Edit"><em aria-label="✏"></em></span>`,
        `<span aria-label="Done"><em aria-label="☑"></em></span>`,
    ];
    toggleEl.innerHTML = states[0];
    toggleEl.style.display = 'block';
    const sortable = new Sortable(containerEl, {
        // Swap: true,
        // TODO: rewrite interpreter to use this
        animation: 333,
        forceFallback: true,
        removeCloneOnHide: true,
        ghostClass: "pointer-events-none",
        onEnd: (event) => {
            payload.push(event.oldIndex);
            payload.push(event.newIndex);
        },
    });
    sortable.option("disabled", true);
    toggleEl.addEventListener("click", () => {
        sortable.option("disabled", !sortable.option("disabled"));
        notifyEl.classList.toggle("edit-active");
        toggleEl.innerHTML = sortable.option("disabled") ? states[0] : states[1];
        if (sortable.option("disabled")) {
            axios
                .get(getPath('API_CONFIG_UPDATE'), {
                    params: {
                        type,
                        payload: JSON.stringify(payload),
                    },
                })
                .finally(() => {
                    socketEmitReload();
                    document.body.querySelector("#toggle-edit-dashboard").checked = false;
                });
            payload = [];

        }else{

        }
    });
};

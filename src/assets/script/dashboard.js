const dashboard = () => {
    let payload = [];
    const type = "signals:order";
    const containerEl = document.querySelector(".dashboard");
    const toggleEl = document.querySelector("#toggle-edit-dashboard");
    const notifyEl = document.documentElement;
    const states = [
        `<span>Edit</span>`,
        `<span>Done</span>`,
    ];
    toggleEl.innerHTML = states[0];
    toggleEl.style.display = 'block';
    const sortable = new Sortable(containerEl, {
        // swap: true, TODO: rewrite interpreter to use this!
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
                .get("/public/config/update", {
                    params: {
                        type,
                        payload: JSON.stringify(payload),
                    },
                })
                .finally(() => {
                    socketEmitReload();
                    document.querySelector("#toggle-edit-dashboard").checked = false;
                });
            payload = [];
        }
    });
};

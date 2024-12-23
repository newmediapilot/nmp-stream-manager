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
                    dashboardBlinkButtons();
                    document.querySelector('#toggle-nav-show').checked = false;
                    document.body.querySelector("#toggle-edit-dashboard").checked = false;
                    containerEl.scrollTo({
                        top: 0,
                        left: 0,
                        behavior: 'smooth'
                    });
                });
            payload = [];
        }
    });
    document.querySelectorAll('section article button').forEach((button) => {
        button.addEventListener('click', () => {
            const res = axios.get(button.getAttribute('data-href'));
            res.then((res) => console.log("sendSignal ::", res));
            res.catch((error) => console.log("sendSignal :: error:", error.response.data));
            res.finally(() => console.info("sendSignal :: complete"));
        })
    });
};
dashboardRotateHue = () => {
    anime({
        targets: "section button:not(:disabled)",
        duration: 3500,
        delay: anime.stagger(50),
        easing: "easeInElastic(1, .6)",
        filter: "hue-rotate(360deg)"
    });
};
dashboardBlinkButtons = () => {
    anime({
        targets: "html section button",
        duration: 666,
        delay: anime.stagger(11),
        easing: "easeInOutCubic",
        direction: "alternate",
        borderTopWidth: ["20px", "200px"],
        borderBottomWidth: ["20px", "200px"],
        borderLeftWidth: ["20px", "200px"],
        borderRightWidth: ["20px", "200px"],
        borderRadius: ["15px", "30px"],
    });
};
dashboardSpinLabels = () => {
    console.log('dashboardSpinLabels');
};

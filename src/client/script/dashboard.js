const dashboard = () => {
    let payload = [];
    const type = "signals:order";
    const containerEl = document.body.querySelector("section");
    const notifyEl = document.documentElement;
    const sortable = new Sortable(containerEl, {
        swap: true,
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

    document.querySelectorAll('nav button').forEach(button => button.style.display = 'none');
    document.querySelector('nav #toggle-controls-open').style.display = 'none';
    document.querySelector('nav #toggle-controls-close').style.display = 'flex';

    document.querySelector('nav #toggle-controls-open').addEventListener("click", () => {
        document.querySelectorAll('nav button').forEach(button => button.style.display = 'none');
        document.querySelector('nav #toggle-controls-close').style.display = 'flex';
    });

    document.querySelector('nav #toggle-controls-close').addEventListener("click", () => {
        document.querySelectorAll('nav button').forEach(button => button.style.display = 'flex');
        document.querySelector('nav #toggle-edit-dashboard-done').style.display = 'none';
        document.querySelector('nav #toggle-controls-close').style.display = 'none';
    });

    document.querySelector('nav #toggle-edit-dashboard-edit').addEventListener("click", () => {
        document.querySelectorAll('nav button').forEach(button => button.style.display = 'none');
        document.querySelector('nav #toggle-edit-dashboard-done').style.display = 'flex';
        notifyEl.classList.add("edit-active");
        sortable.option("disabled", false);
    });
    document.querySelector('nav #toggle-edit-dashboard-done').addEventListener("click", () => {
        document.querySelectorAll('nav button').forEach(button => button.style.display = 'none');
        document.querySelector('nav #toggle-controls-close').style.display = 'flex';
        notifyEl.classList.remove("edit-active");
        sortable.option("disabled", true);
        axios.get(getPath('API_CONFIG_UPDATE'), {
            params: {
                type,
                payload: JSON.stringify(payload),
            },
        })
            .finally(() => {
                dashboardBlinkButtons();
                dashboardFilterButtons(false);
                containerEl.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: 'smooth'
                });
            });
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
dashboardFilterButtons = (filterOut) => {
    document.documentElement.style.setProperty('--controls-filter', String(filterOut ? 1 : 0));
    // TODO: animate buttons out during edit
};
dashboardRotateHue = () => {
    if (document.documentElement.classList.contains('reduced-motion')) {
        return;
    }
    anime({
        targets: "section button:not(:disabled)",
        duration: 3500,
        delay: anime.stagger(50),
        easing: "easeInElastic(1, .6)",
        filter: "hue-rotate(360deg)"
    });
};
dashboardBlinkButtons = () => {
    if (document.documentElement.classList.contains('reduced-motion')) {
        return;
    }
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
    if (document.documentElement.classList.contains('reduced-motion')) {
        return;
    }
    document.querySelectorAll('section article:not(.empty)').forEach(article => {
        const {width: btnWidth} = article.querySelector("button").getBoundingClientRect();
        const {width: lblWidth} = article.querySelector("label:nth-of-type(2)").getBoundingClientRect();
        console.log('btnWidth', btnWidth, 'lblWidth', lblWidth);
        if (lblWidth < btnWidth) return;
        anime({
            targets: article.querySelector("label:nth-of-type(2)"),
            duration: 18000,
            easing: 'easeInOutSine',
            delay: Math.random() * 1500,
            translateX: [`${0}px`, `-${(lblWidth / 2)}px`, `${0}px`],
            loop: true,
            direction: 'alternate',
        });
    });
};

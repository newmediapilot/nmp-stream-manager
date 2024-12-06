const dashboardButtons = (type, containerEl, toggleEl) => {
  let payload = [];
  const editLabel = toggleEl.getAttribute("data-edit");
  const doneLabel = toggleEl.getAttribute("data-done");

  const notifyEl = document.documentElement;
  const states = [
    `<span><em>✏</em>Edit</span>`,
    `<span><em>✅</em>Done</span>`,
  ];

  toggleEl.innerHTML = states[0];

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

    const isDisabled = sortable.option("disabled");
    toggleEl.innerHTML = isDisabled ? states[0] : states[1];

    if (isDisabled) {
      axios
        .get("/public/config/update", {
          params: {
            type,
            payload: JSON.stringify(payload),
          },
        })
        .finally(() => {
          socketEmitReload();
          document.querySelector("#menu-toggle").checked = false;
        });

      payload = [];
    }
  });
};

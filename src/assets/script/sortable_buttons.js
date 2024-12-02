const sortableContainer = (type, containerEl, toggleEl) => {

  function roundBodyHeightToNearest25vh() {
    const clientHeight = document.body.clientHeight;
    const containerHeight = containerEl.clientHeight;
    console.log('clientHeight', clientHeight);
    console.log('containerHeight', containerHeight);
    // document.body.style.height = `${roundedHeight}px`;
  }

  let payload = [];

  const notifyEl = document.documentElement;
  const states = ["✏Edit", "✅Done"];

  toggleEl.innerText = states[0];

  const sortable = new Sortable(containerEl, {
    animation: 333,
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
    toggleEl.innerText = isDisabled ? states[0] : states[1];

    if (isDisabled) {
      axios.get("/public/config/create", {
        params: {
          type,
          payload: JSON.stringify(payload),
        },
      });
      payload = [];
    }

    // Necessary hack
    roundBodyHeightToNearest25vh();

  });

  roundBodyHeightToNearest25vh();
};
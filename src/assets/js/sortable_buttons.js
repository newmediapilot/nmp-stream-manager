const sortableContainer = (draggableEl, toggleEl) => {
    const states = [
        "✏️Enable Edit",
        "✅Done Editing"
    ];
    const sortable = new Sortable(draggableEl, {
        animation: 333,
        ghostClass: 'pointer-events-none',
        onEnd: (event) => {
            console.log(`Moved button from index ${event.oldIndex} to ${event.newIndex}`);
        },
    });
    toggleEl.addEventListener('click', () => {
        sortable.option("disabled", !sortable.option("disabled"));
        toggleEl.innerText = sortable.option("disabled") ? states[0] : states[1];
    });
    toggleEl.innerText = states[0];
    sortable.option("disabled", true);
};
sortableContainer(
    document.querySelector('.button-grid'),
    document.querySelector('.button-grid--toggle'),
);
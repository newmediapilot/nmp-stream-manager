const sortableContainer = (draggableEl, toggleEl) => {
    const sortable = new Sortable(draggableEl, {
        animation: 333,
        ghostClass: 'pointer-events-none',
        onEnd: (event) => {

            console.log(`Moved button from index ${event.oldIndex} to ${event.newIndex}`);
        },
    });
    toggleEl.addEventListener('click', () => {
        sortable.option("disabled", !sortable.option("disabled"));
        toggleEl.innerText = sortable.option("disabled")
            ? "Enable Edit"
            : "Done Editing";
    });
    toggleEl.innerText = "Enable Edit";
};
sortableContainer(
    document.querySelector('.button-grid'),
    document.querySelector('.button-grid--toggle'),
);
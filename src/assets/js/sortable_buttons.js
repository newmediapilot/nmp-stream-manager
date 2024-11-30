const sortableContainer = (draggableEl, toggleEl) => {

    const notifyEl = document.documentElement;
    const states = [
        "✏️Enable Edit",
        "✅Done Editing"
    ];

    const sortable = new Sortable(draggableEl, {
        animation: 333,
        ghostClass: 'pointer-events-none',
        onEnd: (event) => {
            const {oldIndex,newIndex} = event;
            const len = draggableEl.children.length;

        },
    });

    toggleEl.addEventListener('click', () => {
        sortable.option("disabled", !sortable.option("disabled"));
        toggleEl.innerText = sortable.option("disabled") ? states[0] : states[1];
        notifyEl.classList.toggle('edit-active');
    });

    toggleEl.innerText = states[0];
    sortable.option("disabled", true);

};
sortableContainer(
    document.querySelector('.button-grid'),
    document.querySelector('#button-grid--toggle'),
);
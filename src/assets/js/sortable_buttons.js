const sortableContainer = (draggableEl, toggleEl) => {

    let payload = [];// Updates to send

    const notifyEl = document.documentElement;
    const states = [
        "✏️Enable Edit",
        "✅Done Editing"
    ];

    toggleEl.innerText = states[0];

    const sortable = new Sortable(draggableEl, {
        animation: 333,
        ghostClass: 'pointer-events-none',
        onEnd: (event) => {
            // Save to payload for sending
            payload.push(event.oldIndex);
            payload.push(event.newIndex);
        },
    });

    sortable.option("disabled", true);

    toggleEl.addEventListener('click', () => {

        // Flip editable state
        sortable.option("disabled", !sortable.option("disabled"));

        notifyEl.classList.toggle('edit-active');

        const isDisabled = sortable.option("disabled");
        toggleEl.innerText = isDisabled ? states[0] : states[1];

        if (isDisabled) {
            console.log('sent!', payload);
            payload = []; // Reset payload
        }
    });

};
sortableContainer(
    document.querySelector('.button-grid'),
    document.querySelector('#button-grid--toggle'),
);
const sendSignal = (el) => {

    const initialText = el.innerText;
    const waitDefault = 3000;
    const waitInput = el.getAttribute('data-wait') || waitDefault;
    const sendingText = el.getAttribute('data-sending');
    const errorText = el.getAttribute('data-error');
    const successText = el.getAttribute('data-success');

    const setState = (label, active, state) => {
        el.innerText = label;
        el.disabled = active;
        el.setAttribute('data-state', state);
    };

    setState(sendingText, true, 'loading');

    axios.get(el.getAttribute('data-href'))
        .then(response => {
            console.log('Success:', response);
            setState(successText, true, 'success');
            setTimeout(() => setState(initialText, true, 'idle'), waitInput);
        })
        .catch(error => {
            console.log('Error:', error);
            showDialog('generic_dialog', 'Oops', 'Looks like we had an error', 'Continue');
            setState(errorText, true, 'error');
            setTimeout(() => setState(initialText, true, 'idle'), waitDefault);
        })
        .finally(() => {
            console.info('Complete.');
        });
};
const sendSignal = (el) => {

    const initialText = el.innerText;
    const waitDefault = 3000;
    const waitInput = el.getAttribute('data-wait') || waitDefault;
    const sendingText = el.getAttribute('data-sending');
    const errorText = el.getAttribute('data-error');
    const successText = el.getAttribute('data-success');

    const setState = (label, disabled, state) => {
        el.innerText = label;
        el.disabled = disabled;
        el.setAttribute('data-state', state);
    };

    setState(sendingText, true, 'loading');

    const getRes = axios.get(el.getAttribute('data-href'));

    getRes.then(getRes => {
        console.log('Success:', getRes);
        setState(successText, true, 'success');
        setTimeout(() => setState(initialText, true, 'idle'), waitInput);
    });

    getRes.catch(error => {
        console.log('Error:', error);
        // showDialog('generic_dialog', 'Oops', `Looks like we had an error ${error}`, 'Continue');
        setState(errorText, true, 'error');
        setTimeout(() => setState(initialText, true, 'idle'), waitDefault);
        el.blur();
    });

    getRes.finally(() => {
        console.info('Complete.');
    });
};
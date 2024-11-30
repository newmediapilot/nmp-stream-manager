const sendSignal = (el) => {

    const initialText = el.innerText;
    const waitDefault = 3000;
    const sendingText = el.getAttribute('data-sending');
    const errorText = el.getAttribute('data-error');
    const successText = el.getAttribute('data-success');

    const setState = (label, isDisabled, state) => {
        el.innerText = label;
        el.disabled = isDisabled;
        el.setAttribute('data-state', state);
    };

    setState(sendingText, true, 'loading');
    const getRes = axios.get(el.getAttribute('data-href'));

    getRes.then(getRes => {
        console.log('Success:', getRes);
        setState(successText, true, 'success');
        setTimeout(() => setState(initialText, false, 'idle'), waitDefault);
    });

    getRes.catch(error => {
        console.log('Error:', error);
        setState(errorText, true, 'error');
        setTimeout(() => setState(initialText, false, 'idle'), waitDefault);
    });

    getRes.finally(() => {
        console.info('Complete.');
        setTimeout(() => {
            setState(initialText, false, 'idle');
            el.blur();
        }, waitDefault);
    });

};
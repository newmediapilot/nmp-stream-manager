const sendSignal = (el) => {

    const initialText = el.innerText;
    const waitDefault = 3000;

    const waitInput = el.getAttribute('data-wait') || 3000;
    const sendingText = el.getAttribute('data-sending');
    const errorText = el.getAttribute('data-error');
    const successText = el.getAttribute('data-success');

    el.innerText = sendingText;
    el.disabled = true;
    el.setAttribute('data-state', 'loading');

    const reEnable = () => {
        el.disabled = false;
        el.innerText = initialText;
        el.setAttribute('data-state', 'idle');
    };

    axios.get(el.getAttribute('data-href'))
        .then(response => {
            el.innerText = successText;
            el.setAttribute('data-state', 'success');
            console.log('Success:', response);
            setTimeout(() => reEnable(), waitDefault);
        })
        .catch(error => {
            el.innerText = errorText;
            el.setAttribute('data-state', 'error');
            console.error('Error:', error.message);
            setTimeout(() => reEnable(), waitDefault);
            showDialog('generic_dialog', 'Oops', 'Looks like we had an error', 'Continue')
        })
        .finally(() => {
            setTimeout(() => reEnable(), waitInput);
            console.info('Fetch completed.');
        });
}
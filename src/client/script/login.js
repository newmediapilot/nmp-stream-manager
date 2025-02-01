function login() {
    const dialogEl = document.querySelector('#login-dialog');
    const buttonEl = dialogEl.querySelector('button');
    const inputEl = dialogEl.querySelector('input[type=text]');
    buttonEl.addEventListener('click', () => {
        if (inputEl.value.length > 1) {
            const href = `${getPath('TWITCH_LOGIN')}?username=${inputEl.value}`;
            window.location.href = href;
        }
    });
    inputEl.addEventListener('change', () => {
        buttonEl.disabled = (inputEl.value.length === 0);
    });
    buttonEl.disabled = true;
}
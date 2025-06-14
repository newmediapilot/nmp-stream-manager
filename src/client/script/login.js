function login() {
    const dialogEl = document.querySelector('#login-dialog');
    const buttonEl = dialogEl.querySelector('button');
    const inputEl = dialogEl.querySelector('input[type=text]');
    inputEl.value = localStorage.getItem("username") || "";
    buttonEl.addEventListener('click', () => {
        if (inputEl.value.length > 1) {
            const href = `${getPath('TWITCH_LOGIN')}?username=${inputEl.value}`;
            localStorage.setItem("username", inputEl.value);
            if (window.self !== window.top) {
                window.top.location.href = href;
            } else {
                window.location.href = href;
            }
        }
    });
    inputEl.addEventListener('change', () => {
        buttonEl.disabled = (inputEl.value.length === 0);
    });
    buttonEl.disabled = (inputEl.value.length === 0);
}
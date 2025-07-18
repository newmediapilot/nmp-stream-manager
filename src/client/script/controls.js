const initNavControls = () => {
    document.querySelector('nav button:nth-of-type(1)').addEventListener('click', () => getURL(getPath('PANEL_DRAW')));
    document.querySelector('nav button:nth-of-type(2)').addEventListener('click', () => getURL(getPath('PANEL_LAYOUT')));
    document.querySelector('nav button:nth-of-type(3)').addEventListener('click', () => getURL(getPath('PANEL_ACTIONS')));
    document.querySelector('nav button:nth-of-type(4)').addEventListener('click', () => document.body.querySelector('#qr-dialog').showModal());
    document.querySelector('nav button:nth-of-type(5)').addEventListener('click', () => {
        document.body.querySelector('#login-dialog').showModal();
    });
    document.querySelector('nav button:nth-of-type(6)').addEventListener('click', () => window.parent.location.href = getPath('INDEX'));
    document.querySelector('nav button:nth-of-type(7)').addEventListener('click', () => window.parent.location.href = getPath('PANEL_DASHBOARD'));
    document.querySelector('nav button:nth-of-type(8)').addEventListener('click', () => socketEmitReload());
    document.querySelector('nav button:nth-of-type(11)').addEventListener('click', () => {
        getURL("world");
    });
};
const initHomeControls = () => {
    document.querySelector('nav button').addEventListener('click', () => getURL(getPath('PANEL_DASHBOARD')));
};
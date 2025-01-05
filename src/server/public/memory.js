const https = require("https");
const fetch = require("node-fetch");
const {ROUTES} = require("../routes");
const agent = new https.Agent({rejectUnauthorized: false});
const getMemory = async () => {
    try {
        let result;
        const response = await fetch("https://localhost/demo/api/memory/get", {agent});
        const memory = await response.json();
        for (let i = 0; i < memory.length; i++) {
            const [method, url, body] = JSON.parse(memory[i]);
            const path = `https://localhost${url}`;
            if (
                url.includes(ROUTES.API_CONFIG_UPDATE) ||
                url.includes(ROUTES.API_STYLE_UPDATE) ||
                url.includes(ROUTES.API_SIGNAL_CREATE)
            ) {
                result = await fetch(path, {agent, method});
            }
            if (url.includes(ROUTES.API_MEDIA_UPDATE)) {
                result = await fetch(path, {agent, method, body});
            }
            console.log('memory :: fetch', result);
        }
    } catch (error) {
        console.log('memory :: error', error)
    }
};
const setMemory = async () => {
    const response = await fetch("https://localhost/demo/api/memory/set", {agent});
};
module.exports = {getMemory, setMemory};
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
            const [method, url, query, body] = JSON.parse(memory[i]);
            if (url.includes(ROUTES.API_SIGNAL_CREATE)) {
                result = await fetch(`${ROUTES.API_SIGNAL_CREATE}?type=${query.type}&description=${query.description}`, {agent,method});
            }
            if (url.includes(ROUTES.API_CONFIG_UPDATE)) {
                result = await fetch(`${ROUTES.API_CONFIG_UPDATE}?type=${query.type}&description=${query.description}`, {agent,method});
            }
            if (url.includes(ROUTES.API_STYLE_UPDATE)) {
                result = await fetch(`${ROUTES.API_STYLE_UPDATE}?type=${query.type}&description=${query.description}`, {agent,method});
            }
            if (url.includes(ROUTES.API_MEDIA_UPDATE)) {
                result = await fetch(`${ROUTES.API_STYLE_UPDATE}?type=${query.type}&description=${query.description}`, {agent,method, body});
            }
            console.log('memory :: fetch', url, result);
        }
    } catch (error) {
        console.log('memory :: error', error)
    }
};
const setMemory = async () => {
    const response = await fetch("https://localhost/demo/api/memory/set", {agent});
};
module.exports = {getMemory, setMemory};
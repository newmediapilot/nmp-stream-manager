const https = require("https");
const fetch = require("node-fetch");
const {ROUTES} = require("../routes");
const {publicSignalCreate} = require("../public/signal");
const {publicConfigUpdate} = require("../public/config");
const {publicStyleUpdate} = require("../public/style");
const {publicMediaUpdate} = require("../public/media");
const agent = new https.Agent({rejectUnauthorized: false});
const getMemory = async () => {
    const response = await fetch("https://localhost/demo/api/memory/get", {agent});
    const memory = await response.json();
    for (let i = 0; i < memory.length; i++) {
        const [method, url, path, query, params, body] = JSON.parse(memory[i]);
        const req = {
            method, url, path, query, params, body
        };
        const res = {
            send: console.log
        };
        if (url.includes(ROUTES.API_SIGNAL_CREATE)) await publicSignalCreate(req, res);
        if (url.includes(ROUTES.API_CONFIG_UPDATE)) await publicConfigUpdate(req, res);
        if (url.includes(ROUTES.API_STYLE_UPDATE)) await publicStyleUpdate(req, res);
        if (url.includes(ROUTES.API_MEDIA_UPDATE)) await publicMediaUpdate(req, res);
    }
};
const setMemory = async () => {
    const response = await fetch("https://localhost/demo/api/memory/set", {agent});
    // TODO: send style
    // TODO: send config
};
module.exports = {getMemory, setMemory};
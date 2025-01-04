const https = require("https");
const fetch = require("node-fetch");
const {ROUTES} = require("../routes");
const agent = new https.Agent({rejectUnauthorized: false});
const getMemory = async () => {
    const response = await fetch("https://localhost/demo/api/memory/get", {agent});
    const memory = await response.json();
    for (let i = 0; i < memory.length; i++) {
        const [path, type, description, payload] = JSON.parse(memory[i]);
        const url = path.split('/').slice(1);
        if (url.endsWith(ROUTES.API_MEDIA_UPDATE)) {
            await fetch(path, {method: "post"});
        } else {
            await fetch(path, {method: "get"});
        }
        console.log('memory :: mem ::', path, type, description, payload);
    }
};
const setMemory = async () => {
    const response = await fetch("https://localhost/demo/api/memory/set", {agent});
    // TODO: send style
    // TODO: send config
};
module.exports = {getMemory, setMemory};
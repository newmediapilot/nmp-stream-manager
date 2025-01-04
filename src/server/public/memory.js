const https = require("https");
const fetch = require("node-fetch");
const agent = new https.Agent({rejectUnauthorized: false});
const getMemory = async () => {
    const response = await fetch("https://localhost/demo/api/memory/get", {agent});
    const memory = await response.json();
    for (let i = 0; i < memory.length; i++) {
        const [method, url, body] = JSON.parse(memory[i]);
        if ("GET" === method) await fetch(`https://localhost/demo/${url}`, {agent, method});
        if ("POST" === method) await fetch(`https://localhost/demo/${url}`, {agent, method, body});
        console.log('getMemory :: method', method);
        console.log('getMemory :: url', url);
        console.log('getMemory :: body', body);
    }
};
const setMemory = async () => {
    const response = await fetch("https://localhost/demo/api/memory/set", {agent});
    // TODO: send style
    // TODO: send config
};
module.exports = {getMemory, setMemory};
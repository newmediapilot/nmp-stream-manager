const https = require("https");
const fetch = require("node-fetch");
const {ROUTES} = require("../routes");
const agent = new https.Agent({rejectUnauthorized: false});
const getMemory = async () => {
    const response = await fetch("https://localhost/demo/api/memory/get", {agent});
    const memory = await response.json();
    for (let i = 0; i < memory.length; i++) {
      console.log('memory', memory[i]);
    }
};
const setMemory = async () => {
    const response = await fetch("https://localhost/demo/api/memory/set", {agent});
    // TODO: send style
    // TODO: send config
};
module.exports = {getMemory, setMemory};
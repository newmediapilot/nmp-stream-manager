const https = require("https");
const fetch = require("node-fetch");
const agent = new https.Agent({rejectUnauthorized: false});
const getMemory = async () => {
    const response = await fetch("https://localhost/demo/api/memory/get", {agent});
    const memory = await response.json();
    console.log('memory', memory);
};
const setMemory = async () => {
    const response = await fetch("https://localhost/demo/api/memory/set", {agent});
};
module.exports = {getMemory, setMemory};
const https = require("https");
const fetch = require("node-fetch");
const agent = new https.Agent({rejectUnauthorized: false});
const getMemory = async () => {
    const response = await fetch("https://192.168.0.22/demo/api/memory/get", {agent});
    const responseBody = await response.json();
    console.log('getMemory ::', responseBody);
};
const setMemory = async () => {
    const response = await fetch("https://192.168.0.22/demo/api/memory/set", {agent});
    console.log('setMemory ::', response.body);
};
module.exports = {getMemory, setMemory};
const fetch = require("node-fetch");
const getMemory = async () => {
    const response = await fetch("https://192.168.0.22/demo/api/memory/get");
    console.log('getMemory ::', response);
};
const setMemory = async () => {
    const response = await fetch("https://192.168.0.22/demo/api/memory/set");
    console.log('setMemory ::', response);
};
module.exports = {getMemory, setMemory};
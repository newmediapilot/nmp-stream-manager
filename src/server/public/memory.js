const https = require("https");
const fetch = require("node-fetch");
const agent = new https.Agent({rejectUnauthorized: false});
const getMemory = async () => {
    try {
        let result;
        const response = await fetch("https://localhost/demo/api/memory/get", {agent});
        const memory = await response.json();
        for (let i = 0; i < memory.length; i++) {
            try {
                const [method, url, body] = JSON.parse(memory[i]);
                // console.log('memory :: method', method);
                console.log('memory :: url', url);
                // console.log('memory :: body', body);
                const path = `https://localhost${url}`;
                if (url.includes(`api/media/update`)) {
                    console.log('memory :: [media]');
                    result = await fetch(path.replace('/api/', '/memory/'), {agent, method, body:{method, url, body}});
                } else {
                    console.log('memory :: [signal]');
                    result = await fetch(path.replace('/api/', '/memory/'), {agent, method});
                }
                console.log('memory :: loop status', result.status);
            } catch (error) {
                console.log('memory :: loop error', error);
            }
        }
    } catch (error2) {
        console.log('memory :: root error', error2);
    }
};
const setMemory = async () => {
    const response = await fetch("https://localhost/demo/api/memory/set", {agent});
};
module.exports = {getMemory, setMemory};
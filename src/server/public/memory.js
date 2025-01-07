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
                const path = `https://localhost${url}`;
                if (url.includes(`api/media/update`)) {
                    console.log('memory :: [media]');
                    result = await fetch(path.replace('/api/', '/memory/'),
                        {
                            agent,
                            method,
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({method, url, body}),
                        }
                    );
                } else {
                    console.log('memory :: [signal]');
                    result = await fetch(path.replace('/api/', '/memory/'),
                        {
                            agent,
                            headers: {'Content-Type': 'application/json'},
                            method,
                        }
                    );
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
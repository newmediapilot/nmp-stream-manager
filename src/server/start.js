const fs = require("fs");
const https = require("https");
const {setParam} = require("./store/manager");
const {configureNunjucks} = require("./nunjucks/configure");
const {createBpmServer} = require("./bpm/listen");
const {initializePublicConfigs} = require("./public/config");
const {initializePublicStyles} = require("./public/style");
const {configureSocket} = require("./helper/socket");
const ROUTES = require("./routes");
async function startServices(app) {
    try {
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
            console.log( "Server running on 443 at https://localhost");
        });
        configureSocket(httpsServer);
        await createBpmServer(app);
    } catch (err) {
        console.log( "Error initializing services:", err);
    }
}
module.exports = {startServices};
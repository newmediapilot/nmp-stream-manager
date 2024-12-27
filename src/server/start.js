const https = require("https");
const {setParam, getSecret} = require("./store/manager");
const {configureNunjucks} = require("./nunjucks/configure");
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
            key: getSecret('keys')['private'],
            cert: getSecret('keys')['cert'],
        };
        const httpsServer = https.createServer(certs, app).listen(443, () => {
            console.log("startServices :: server running on 443 at https://localhost");
        });
        configureSocket(httpsServer);
    } catch (err) {
        console.log("startServices :: error initializing services:", err);
    }
}

module.exports = {startServices};
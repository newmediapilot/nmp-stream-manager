const {execSync} = require("child_process");
const https = require("https");
const {getSecret} = require("./store/manager");
const {setParam} = require("./store/manager");
const {configureNunjucks} = require("./nunjucks/environment");
const {initializePublicConfigs} = require("./public/config");
const {initializePublicStyles} = require("./public/style");
const {initializeMedia} = require("./public/media");
const {configureSocket} = require("./helper/socket");
const {sendMedia, sendConfig, sendStyle} = require("./public/memory");
const {ROUTES} = require("./routes");

const startServices = async (app) => {
    try {
        setParam("public_index", "https://dbdbdbdbdbgroup.com/demo/");
        setParam("public_routes", ROUTES);
        configureNunjucks(app);
        const certs = {
            key: getSecret('keys')['private'],
            cert: getSecret('keys')['cert'],
        };
        https.createServer(certs, app).listen(443, () => {
            console.log("startServices :: server running on 443 at https://localhost");
        });
        await initializePublicConfigs("signals");
        await initializePublicStyles("style");
        await sendMedia();
        await sendConfig();
        await sendStyle();
        initializeMedia();
        configureSocket();
        execSync(`start "" "https://dbdbdbdbdbgroup.com/demo/index.html"`, {stdio: 'ignore'});
    } catch (err) {
        console.log("startServices :: error initializing services:", err);
    }
};

module.exports = {startServices};
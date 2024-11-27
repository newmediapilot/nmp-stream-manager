require("./console");
const fs = require("fs");
const https = require("https");
const { configureNunjucks } = require("./nunjucks/config");
const { setParam } = require("./store/manager");
const ROUTES = require("../routes");

async function startServices(app) {
  try {
    setParam("public_routes", ROUTES);

    setParam("twitch_username", process.env.TWITCH_USERNAME);

    configureNunjucks(app);

    const certs = {
      key: fs.readFileSync("./localhost.key"),
      cert: fs.readFileSync("./localhost.crt"),
    };

    https.createServer(certs, app).listen(443, () => {
      console.log2(process.cwd(), "Server running at https://localhost");
    });
  } catch (err) {
    console.log2(process.cwd(), "Error initializing services:", err);
  }
}

module.exports = { startServices };
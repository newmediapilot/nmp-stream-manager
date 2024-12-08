/**
 * File: src\modules\start.js
 * Description: Logic and operations for src\modules\start.js.
 */
require("./console"); // Set up console, keep!
const fs = require("fs");
const https = require("https");
const { getIp } = require("./helper/ip");
const { setParam } = require("./store/manager");
const { configureNunjucks } = require("./nunjucks/config");
const { createHeartRateServer } = require("./sensor/listen");
const { initializePublicConfigs } = require("./public/config");
const { initializePublicStyles } = require("./public/style");
const { configureSocket } = require("./helper/socket"); // Use configureSocket for socket setup
const ROUTES = require("../routes");

/**
 * Initializes and starts the application services.
 * @param {object} app - The Express app instance.
 */
async function startServices(app) {
  try {
    // Store internal IP
    setParam("device_ip", getIp());

    // Export public routes
    setParam("public_routes", ROUTES);

    // Set Twitch data
    setParam("twitch_username", process.env.TWITCH_USERNAME);

    // Initialize dashboard data
    await initializePublicConfigs("signals");

    // Initialize module styling
    await initializePublicStyles("style");

    // Configure Nunjucks
    configureNunjucks(app);

    const certs = {
      key: fs.readFileSync("./localhost.key"),
      cert: fs.readFileSync("./localhost.crt"),
    };

    // HTTPS server (on port 443)
    const httpsServer = https.createServer(certs, app).listen(443, () => {
      console.log2(process.cwd(), "Server running on 443 at https://localhost");
    });

    // Configure Socket.IO for the HTTPS server
    configureSocket(httpsServer);

    // Heart Rate Server
    app.listen(3476, () => {
      console.log2(
        process.cwd(),
        "Server running on 3476 at https://localhost",
      );
    });

    // Launch heart rate server
    await createHeartRateServer();

  } catch (err) {
    console.log2(process.cwd(), "Error initializing services:", err);
  }
}

module.exports = { startServices };

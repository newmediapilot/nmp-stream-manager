/**
 * File: src\modules\start.js
 * Description: Logic and operations for src\modules\start.js.
 */

require("./console");
const open = require("open");
const fs = require("fs");
const https = require("https");
const { configureNunjucks } = require("./nunjucks/config");
const { setParam } = require("./store/manager");
const { createHeartRateServer } = require("./sensor/listen");
const { getConfig } = require("./public/config");
const ROUTES = require("../routes");

/**
 * Initializes and starts the application services.
 * @param {object} app - The Express app instance.
 * @param {number} PORT - The port number for the server.
 */
async function startServices(app) {
  try {
    // Export public routes
    setParam("public_routes", ROUTES);

    // Set twitch data
    setParam("twitch_username", process.env.TWITCH_USERNAME);

    // Set buttons data
    setParam("dashboard_signals_config", getConfig("signals"));

    // Configure Nunjucks
    configureNunjucks(app);

    const certs = {
      key: fs.readFileSync("./localhost.key"),
      cert: fs.readFileSync("./localhost.crt"),
    };

    // HTTPS
    https
      .createServer(certs, app)
      .listen(
        443,
        console.log2(
          process.cwd(),
          "Server running on 443 at https://localhost",
        ),
      );

    // Heart Rate Server
    app.listen(
      console.log2(
        process.cwd(),
        "Server running on 3476 at https://localhost",
      ),
    );

    // Launch server exe file
    await createHeartRateServer();

    // Open and login
    await open(`https://localhost${ROUTES.TWITCH_LOGIN}`);
  } catch (err) {
    console.log2(process.cwd(), "Error initializing services:", err);
  }
}

module.exports = { startServices };

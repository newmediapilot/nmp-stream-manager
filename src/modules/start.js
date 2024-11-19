// src/modules/start.js
const { setParam, hasSecret } = require('./store/manager');
const { twitchCommandsGet } = require('./twitch/commands');
const { ngrokLaunch } = require('./ngrok/launch'); // Import Ngrok helper
const { configureNunjucks } = require('./nunjucks/config'); // Import Nunjucks configuration
const ROUTES = require('../routes');

/**
 * Initializes and starts the application services.
 * @param {object} app - The Express app instance.
 * @param {number} PORT - The port number for the server.
 */
async function startServices(app, PORT) {
    try {

        // Store paths
        setParam('public_url',  await ngrokLaunch(PORT));
        setParam('public_routes', ROUTES);

        // Set twitch data
        setParam('twitch_username', process.env.TWITCH_USERNAME);
        setParam('twitch_commands', twitchCommandsGet());

        // Configure Nunjucks
        configureNunjucks(app);

        // Start
        app.listen(PORT);

    } catch (err) {
        console.error('Error initializing services:', err);
    }
}

module.exports = { startServices };

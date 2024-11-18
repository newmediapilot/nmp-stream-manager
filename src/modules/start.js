// src/modules/start.js
const { setParam, hasSecret } = require('./store/manager');
const { ngrokLaunch } = require('./ngrok/launch'); // Import Ngrok helper
const { configureNunjucks } = require('./nunjucks/config'); // Import Nunjucks configuration

/**
 * Initializes and starts the application services.
 * @param {object} app - The Express app instance.
 * @param {number} PORT - The port number for the server.
 */
async function startServices(app, PORT) {
    try {

        // Store public proxy url
        setParam('public_url',  await ngrokLaunch(PORT));

        // Set statuses
        setParam('twitch_access_token_set', hasSecret('twitch_access_token'));
        setParam('twitch_refresh_token_set', hasSecret('twitch_refresh_token'));

        // Configure Nunjucks
        configureNunjucks(app);

        // Start
        app.listen(PORT);

    } catch (err) {
        console.error('Error initializing services:', err);
    }
}

module.exports = { startServices };

// src/modules/start.js
const { configureNunjucks } = require('./nunjucks/config'); // Import Nunjucks configuration
const { setParam } = require('./store/manager');
const ROUTES = require('../routes');

/**
 * Initializes and starts the application services.
 * @param {object} app - The Express app instance.
 * @param {number} PORT - The port number for the server.
 */
async function startServices(app, PORT) {
    try {

        setParam('public_routes', ROUTES);

        // Set twitch data
        setParam('twitch_username', process.env.TWITCH_USERNAME);

        // Configure Nunjucks
        configureNunjucks(app);

        // Start
        app.listen(PORT);

    } catch (err) {
        console.log('Error initializing services:', err);
    }
}

module.exports = { startServices };

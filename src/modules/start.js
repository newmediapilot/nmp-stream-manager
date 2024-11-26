// src/modules/start.js
const fs = require('fs');
const https = require('https');
const { configureNunjucks } = require('./nunjucks/config')
const { setParam } = require('./store/manager');
const ROUTES = require('../routes');

/**
 * Initializes and starts the application services.
 * @param {object} app - The Express app instance.
 * @param {number} PORT - The port number for the server.
 */
async function startServices(app) {
    try {

        // Export public routes
        setParam('public_routes', ROUTES);

        // Set twitch data
        setParam('twitch_username', process.env.TWITCH_USERNAME);

        // Configure Nunjucks
        configureNunjucks(app);

        const certs = {
            key: fs.readFileSync('./localhost.key'),
            cert: fs.readFileSync('./localhost.crt'),
        };

        // Start
        https.createServer(certs, app).listen(443, () => {
            console.log('Server running at https://localhost');
        });

    } catch (err) {
        console.log('Error initializing services:', err);
    }
}

module.exports = { startServices };

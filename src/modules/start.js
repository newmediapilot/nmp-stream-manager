// src/modules/start.js
const open = require('open');
const express = require('express');
const { setParam, getParam, hasSecret } = require('./store/manager');
const { ngrokLaunch } = require('./ngrok/launch'); // Import Ngrok helper
const { configureNunjucks } = require('./nunjucks/config'); // Import Nunjucks configuration

/**
 * Initializes and starts the application services.
 * @param {object} app - The Express app instance.
 * @param {number} PORT - The port number for the server.
 */
async function startServices(app, PORT) {
    try {
        const publicUrl = await ngrokLaunch(PORT);

        // Some setup
        setParam('public_url', publicUrl);

        // Set statuses
        setParam('twitch_access_token_set', hasSecret('twitch_access_token'));
        setParam('twitch_refresh_token_set', hasSecret('twitch_refresh_token'));

        // Configure Nunjucks
        configureNunjucks(app);

        // Open the public URL
        await open(`${getParam('public_url')}/public/index`);

        app.listen(PORT);

    } catch (err) {
        console.error('Error initializing services:', err);
    }
}

module.exports = { startServices };

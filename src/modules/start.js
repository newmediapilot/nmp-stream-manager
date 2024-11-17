// src/modules/start.js
const open = require('open');
const express = require('express');
const { setParam, getParam } = require('./store/manager');
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
        setParam('public_url', publicUrl);

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

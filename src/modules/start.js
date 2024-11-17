/**
 * File: src\modules\start.js
 * Description: This file contains logic for managing src\modules\start operations.
 * Usage: Import relevant methods/functions as required.
 */
const open = require('open');
const express = require('express');
const { ngrokLaunch } = require('./ngrok/launch'); // Import Ngrok helper
const nunjucks = require('nunjucks');

/**
 * startServices: entry point for the server, it contains
 * boot procedures sets the initial open URL, and configures Nunjucks
 * @param app
 * @param PORT
 * @returns {Promise<void>}
 */
async function startServices(app, PORT) {
    try {
        const publicUrl = await ngrokLaunch(PORT);

        nunjucks.configure('src/views', {  // Path to your views folder
            autoescape: true,  // Escape HTML in variables to prevent XSS
            express: app,      // Bind Nunjucks to Express app
        });

        app.set('view engine', 'html');

        app.use(express.static('src/assets'));

        console.log(`Opening Twitch login URL...`);
        await open(`${publicUrl}/public/index`);

        app.listen(PORT, () => {
            console.log(`App service running locally on http://localhost:${PORT}`);
            console.log(`TWEET: ${publicUrl}/twitter/tweet?tweet_message=HelloWorld!`);
            console.log(`TWITCH LOGIN: ${publicUrl}/twitch/login`);
            console.log(`LOGIN: ${publicUrl}/twitch/login`);
        });

    } catch (err) {
        console.error('Error initializing services:', err);
    }
}

module.exports = { startServices };
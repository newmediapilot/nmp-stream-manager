/**
 * File: src\modules\start.js
 * Description: This file contains logic for managing src\modules\start operations.
 * Usage: Import relevant methods/functions as required.
 */
const open = require('open');
const express = require('express');
const nunjucks = require('nunjucks');
const {setParam, getParam} = require('./store/manager');
const {ngrokLaunch} = require('./ngrok/launch'); // Import Ngrok helper

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
        setParam('public_url', publicUrl);

        // Configure nunjucks
        const nunjucksEnv = nunjucks.configure('src/views', {  // Path to your views folder
            autoescape: true,  // Escape HTML in variables to prevent XSS
            express: app,      // Bind Nunjucks to Express app
        });

        // Add a custom filter for getParam
        nunjucksEnv.addFilter('getParam', getParam);
        app.set('view engine', 'html');
        app.use(express.static('src/assets'));

        // Open publicUrl to start
        await open(`${getParam('publicUrl')}/public/index`);

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

module.exports = {startServices};
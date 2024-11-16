const open = require('open');
const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const { ngrokLaunch } = require('./ngrok/launch'); // Import Ngrok helper
const fs = require('fs');

// Load Handlebars config from the JSON file
const handlebarsConfig = require('../../handlebars-config');

async function startServices(app, PORT) {
    try {
        const publicUrl = await ngrokLaunch(PORT);

        // Initialize Handlebars as the template engine using the config loaded from js
        app.engine('hbs', exphbs.engine(handlebarsConfig));
        app.set('views', path.join('src','public','partials'));
        app.set('view engine', 'hbs'); // Use Handlebars for rendering views

        // Serve static files (CSS, JS, images) from the 'src/public/assets/' folder
        app.use(express.static(path.join(__dirname, 'src/public/assets')));

        // Automatically open the URL for the Twitch login page with the specified intent
        console.log(`Opening Twitch login URL...`);
        await open(`${publicUrl}/twitch/login`);

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

const open = require('open');
const express = require('express');
const { ngrokLaunch } = require('./ngrok/launch'); // Import Ngrok helper
const nunjucks = require('nunjucks');

async function startServices(app, PORT) {
    try {
        const publicUrl = await ngrokLaunch(PORT);

        // Set up Nunjucks as the templating engine
        nunjucks.configure('src/views', {  // Path to your views folder
            autoescape: true,  // Escape HTML in variables to prevent XSS
            express: app,      // Bind Nunjucks to Express app
        });

        // Tell Express to use Nunjucks
        app.set('view engine', 'html');

        // Serve static files (CSS, JS, images) from the 'src/public/assets/' folder
        app.use(express.static('src/assets'));

        // Automatically open the URL for the Twitch login page with the specified intent
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

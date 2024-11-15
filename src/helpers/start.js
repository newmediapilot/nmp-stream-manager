const open = require('open');
const { ngrokLaunch } = require('./ngrok/launch'); // Import Ngrok helper

async function startServices(app, PORT) {
    try {
        const publicUrl = await ngrokLaunch(PORT);

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

require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const {ngrokLaunch} = require('./helpers/ngrok/launch'); // Import Ngrok helper
const {twitterTweet} = require('./helpers/twitter/tweet'); // Import Twitter helper
const {twitchLogin} = require('./helpers/twitch/login'); // Import the twitchLogin function
const {twitchClipCreate} = require('./helpers/twitch/clip'); // Import the clipHelper function
const {sensorData} = require('./helpers/sensor/data'); // Import the fetchSensorData function
const open = require('open'); // To open the URL automatically

const app = express();
const PORT = 80; // Local port for your server

// TWITTER
app.get('/twitter/tweet', (req, res) => twitterTweet(req, res));

// TWITCH
app.get('/twitch/login', (req, res) => twitchLogin(req, res));
app.get('/twitch/login/success', (req, res) => res.send('/twitch/login/success 200 OK')); // just log OK
app.get('/twitch/clip/create', (req, res) => twitchClipCreate(req, res));

// SENSOR LOGGER
app.get('/sensor/data', (req, res) => sensorData(req, res));

async function startServices() {
    try {
        const publicUrl = await ngrokLaunch(PORT);

        // Automatically open the URL for the Twitch login page with the specified intent
        console.log(`Opening Twitch login URL...`);
        await open(`${publicUrl}/twitch/login?twitch_login_intent=/twitch/login/success`);

        app.listen(PORT, () => {
            console.log(`App service running locally on http://localhost:${PORT}`);
            console.log(`TWEET: ${publicUrl}/twitter/tweet?tweet_message=HelloWorld`);
            console.log(`Twitch LOGIN: ${publicUrl}/twitch/login?twitch_login_intent=/twitch/login/success`);
            console.log(`LOGIN: ${publicUrl}/twitch/login`);
        });
    } catch (err) {
        console.error('Error initializing services:', err);
    }
}

startServices();

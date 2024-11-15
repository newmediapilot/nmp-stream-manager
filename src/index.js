require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const {launch} = require('./helpers/ngrok/launcher'); // Import Ngrok helper
const {tweet} = require('./helpers/twitter/tweet'); // Import Twitter helper
const {twitchLogin} = require('./helpers/twitch/oauth'); // Import the twitchLogin function
const {clipHelper} = require('./helpers/twitch/clip'); // Import the clipHelper function
const {fetchSensorData} = require('./helpers/sensor-logger/sensor'); // Import the fetchSensorData function

const app = express();
const PORT = 80; // Local port for your server

// TWITTER
app.get('/tweet', (req, res) => tweet(req, res));

// TWITCH
app.get('/twitch/login', (req, res) => twitchLogin(req, res));
app.get('/twitch/clip', (req, res) => clipGateway(req, res));
app.get('/twitch/clip/create', (req, res) => clipHelper(req, res));

// SENSOR LOGGER
app.get('/sensor/data', (req, res) => fetchSensorData(req, res));

async function startServices() {
    try {
        const publicUrl = await launch(PORT);

        app.listen(PORT, () => {
            console.log(`App service running locally on http://localhost:${PORT}`);
            console.log(`TWEET: ${publicUrl}/tweet?m=HelloWorld`);
            console.log(`Twitch LOGIN: ${publicUrl}/twitch/login?twitch_login_intent=/twitch/clip/create`);
            console.log(`CLIP: ${publicUrl}/twitch/clip`);
        });
    } catch (err) {
        console.error('Error initializing services:', err);
    }
}

startServices();

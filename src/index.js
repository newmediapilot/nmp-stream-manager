require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const {startNgrok} = require('./helpers/ngrok/launcher'); // Import Ngrok helper
const {tweet} = require('./helpers/twitter/sender'); // Import Twitter helper
const {setParam} = require('./helpers/store/manager'); // Import the callbackHelper function
const {getSecret} = require('./helpers/store/manager'); // Import the getSecret method
const {twitchLogin} = require('./helpers/twitch/oauth'); // Import the twitchLogin function
const {clipHelper} = require('./helpers/twitch/clip'); // Import the clipHelper function

const app = express();
const PORT = 80; // Local port for your server

app.get('/tweet', (req, res) => tweet(req, res));

app.get('/twitch/login', (req, res) => {
    const twitch_login_intent = req.query.twitch_login_intent || null;
    console.log(`Redirecting to Twitch login with intent: ${twitch_login_intent}`);

    if (twitch_login_intent) {
        setParam('twitch_login_intent', twitch_login_intent);
    }

    twitchLogin(req, res);
});

app.get('/twitch/clip', (req, res) => {
    // Check if the 'access_token' and 'refresh_token' exist in the secret file
    const accessToken = getSecret('access_token');
    const refreshToken = getSecret('refresh_token');

    if (accessToken && refreshToken) {
        // Tokens are present, proceed to redirect to the clip creation endpoint
        console.log('Access token and refresh token found, redirecting to /twitch/clip/create');
        return res.redirect('/twitch/clip/create');
    }

    // If tokens are not present, initiate the login flow
    console.log('Access token or refresh token not found, redirecting to /twitch/login');
    res.redirect('/twitch/login?twitch_login_intent=/twitch/clip/create');
});

app.get('/twitch/clip/create', (req, res) => clipHelper(req, res));

async function startServices() {
    try {
        const publicUrl = await startNgrok(PORT);

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

require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const { startNgrok } = require('./helpers/ngrokHelper'); // Import Ngrok helper
const { tweet } = require('./helpers/twitterHelper'); // Import Twitter helper
const { setParam } = require('./helpers/callbackHelper'); // Import the callbackHelper function
const { twitchLogin } = require('./helpers/twitchHelper'); // Import the twitchLogin function
const { clipHelper } = require('./helpers/clipHelper'); // Import the createClip function

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
    const twitch_clip_title = req.query.twitch_clip_title; // Get the 'twitch_clip_title' query parameter (clip title)

    if (!twitch_clip_title) {
        return res.status(400).send('No clip title provided.'); // Return an error if 'm' is missing
    }

    // Capture the 'm' value using setParam
    setParam('twitch_clip_title', twitch_clip_title); // Store the clip title as 'twitch_clip_title'

    // Redirect to /twitch/login with intent set to '/twitch/redirect/clip'
    res.redirect('/twitch/login?twitch_login_intent=/twitch/redirect/clip');
});

app.get('/twitch/redirect/clip', (req, res) => clipHelper(req, res));

async function startServices() {
    try {
        const publicUrl = await startNgrok(PORT);

        app.listen(PORT, () => {
            console.log(`App service running locally on http://localhost:${PORT}`);
            console.log(`TWEET: ${publicUrl}/tweet?m=HelloWorld`);
            console.log(`Twitch LOGIN: ${publicUrl}/twitch/login?twitch_login_intent=/twitch/redirect/clip`);
            console.log(`CLIP: ${publicUrl}/twitch/clip?twitch_clip_title=OptionalMessage`);
        });
    } catch (err) {
        console.error('Error initializing services:', err);
    }
}

startServices();

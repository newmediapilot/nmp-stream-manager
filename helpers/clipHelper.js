require('dotenv').config(); // Load environment variables from .env
const axios = require('axios');
const { getParam } = require('./callbackHelper'); // Import the callbackHelper to access stored params
const { getOAuthTokens, getBroadcasterId } = require('./twitchHelper'); // Import getOAuthTokens and getBroadcasterId from twitchHelper

async function clipHelper(req, res) {
    try {
        const message = getParam('twitch_clip_title'); // Get the 'twitch_clip_title' query parameter for the clip title
        if (!message) {
            return res.status(400).send('No message provided for creating clip.');
        }

        // Get the 'code' query parameter directly from the request
        const code = req.query.code; // Get the OAuth code from the query parameters
        console.log('Received code from query:', code); // Log the code received
        if (!code) {
            return res.status(400).send('OAuth code missing. Please authenticate first.');
        }

        // Exchange the OAuth code for an access token (if not already done)
        const tokenResponse = await getOAuthTokens(code); // Get the OAuth token using the code
        const accessToken = tokenResponse.access_token;

        // Log the access token to verify it
        console.log('Received access token:', accessToken);

        // Check if accessToken is valid
        if (!accessToken) {
            return res.status(400).send('Failed to get access token.');
        }

        // Get the broadcaster's ID using the username
        const broadcasterId = await getBroadcasterId(process.env.TWITCH_USERNAME);

        // Log the broadcaster ID to verify
        console.log('Broadcaster ID:', broadcasterId);

        // Make the API call to create the clip
        const response = await axios.post(
            'https://api.twitch.tv/helix/clips',
            {
                broadcaster_id: broadcasterId, // Use the broadcaster ID obtained
            },
            {
                headers: {
                    'Client-ID': process.env.TWITCH_CLIENT_ID,
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        if (response.data.error === 'Not Found' && response.data.message === 'Clipping is not possible for an offline channel.') {
            return res.status(404).send('Clipping is not possible for an offline channel. Please make sure the channel is online and try again.');
        }

        const clipId = response.data.data[0].id;
        const clipUrl = `https://clips.twitch.tv/${clipId}`;

        res.send(`Clip titled "${message}" created successfully: ${clipUrl}`); // Return the clip URL
    } catch (error) {
        // Log detailed error for debugging
        console.error('Error creating clip:', error.response?.data || error.message);

        if (error.response?.data?.message === 'Clipping is not possible for an offline channel.') {
            return res.status(404).send('Clipping is not possible for an offline channel. Please make sure the channel is online and try again.');
        }

        res.send('Failed to create clip: ' + error.message); // Return an error if something goes wrong
    }
}

module.exports = { clipHelper };

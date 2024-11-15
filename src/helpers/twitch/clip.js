require('dotenv').config(); // Load environment variables from .env
const axios = require('axios');
const {getBroadcasterId} = require('./oauth'); // Import the getBroadcasterId to access stored params
const {getSecret} = require('../store/manager'); // Import getSecret to fetch the access token

async function clipHelper(req, res) {
    try {

        // Retrieve the access token from the .secrets file
        const accessToken = getSecret('access_token');
        if (!accessToken) {
            return res.status(400).send('Access token is missing. Please authenticate first.');
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

        res.send(`Clip created successfully: ${clipUrl}`); // Return the clip URL
    } catch (error) {
        // Log detailed error for debugging
        console.error('Error creating clip:', error.response?.data || error.message);

        if (error.response?.data?.message === 'Clipping is not possible for an offline channel.') {
            return res.status(404).send('Clipping is not possible for an offline channel. Please make sure the channel is online and try again.');
        }

        res.send('Failed to create clip: ' + error.message); // Return an error if something goes wrong
    }
}

async function clipGateway(req, res) {
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
}

module.exports = {clipHelper, clipHelper};

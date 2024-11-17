require('dotenv').config(); // Load environment variables from .env
const axios = require('axios');

// Function to generate the OAuth login URL and redirect the user
function twitchLogin(req, res) {
    const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
    const TWITCH_REDIRECT_URL = process.env.TWITCH_REDIRECT_URL;
    const TWITCH_SCOPES = 'clips:edit';

    // Proceed directly to the regular OAuth flow
    const oauthUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${TWITCH_CLIENT_ID}&redirect_uri=${encodeURIComponent(TWITCH_REDIRECT_URL)}&response_type=code&scope=${TWITCH_SCOPES}`;
    res.redirect(oauthUrl); // Redirect the user to the Twitch login URL
}

// Function to get the broadcaster's ID by username
async function getBroadcasterId(username) {
    try {
        const accessToken = getSecret('access_token'); // Get the access token from setParam
        const response = await axios.get(`https://api.twitch.tv/helix/users?login=${username}`, {
            headers: {
                'Client-ID': process.env.TWITCH_CLIENT_ID,
                Authorization: `Bearer ${accessToken}`, // Use the access token here
            },
        });

        if (response.data.data && response.data.data.length > 0) {
            return response.data.data[0].id; // Return the broadcaster ID
        } else {
            throw new Error('No broadcaster found');
        }
    } catch (error) {
        console.error('Error fetching broadcaster ID:', error);
        throw error;
    }
}

module.exports = { twitchLogin, getBroadcasterId };

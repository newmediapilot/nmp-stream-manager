require('dotenv').config(); // Load environment variables from .env
const { getSecret,setSecret} = require('./callbackHelper'); // Import setParam to save parameters
const axios = require('axios');

// Function to generate the OAuth login URL and redirect the user
function twitchLogin(req, res) {
    const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
    const TWITCH_REDIRECT_URL = process.env.TWITCH_REDIRECT_URL;
    const TWITCH_SCOPES = 'clips:edit';

    const twitch_login_intent = req.query.twitch_login_intent || null;
    console.log(`twitchLogin called with twitch_login_intent: ${twitch_login_intent}`);

    // If no 'twitch_login_intent' is provided, stop the flow and do nothing
    if (!twitch_login_intent) {
        console.log('No twitch_login_intent provided. Stopping the flow.');
        return res.status(400).send('No valid intent provided.');
    }

    // Otherwise, proceed with the regular OAuth flow
    const oauthUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${TWITCH_CLIENT_ID}&redirect_uri=${encodeURIComponent(TWITCH_REDIRECT_URL)}&response_type=code&scope=${TWITCH_SCOPES}`;
    res.redirect(oauthUrl); // Redirect the user to the Twitch login URL
}

// Function to exchange the OAuth code for an access token and refresh token
async function getOAuthTokens(code) {
    try {
        const response = await axios.post('https://id.twitch.tv/oauth2/token', null, {
            params: {
                client_id: process.env.TWITCH_CLIENT_ID,
                client_secret: process.env.TWITCH_CLIENT_SECRET,
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: process.env.TWITCH_REDIRECT_URL,
            },
        });

        const accessToken = response.data.access_token;
        const refreshToken = response.data.refresh_token;

        // Store the access token and refresh token in .secrets file
        setSecret('access_token', accessToken); // Save access_token
        setSecret('refresh_token', refreshToken); // Save refresh_token

        // Log the response and tokens
        console.log('OAuth token response:', response.data);
        console.log('Access Token:', accessToken);
        console.log('Refresh Token:', refreshToken);

        return response.data; // Return the access token and refresh token
    } catch (error) {
        console.error('Error exchanging code for tokens:', error.response?.data || error.message);
        throw new Error('Failed to get OAuth tokens');
    }
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

module.exports = {twitchLogin, getOAuthTokens, getBroadcasterId};

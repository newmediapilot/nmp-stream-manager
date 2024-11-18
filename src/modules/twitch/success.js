/**
 * File: src\modules\twitch\success.js
 * Description: This file contains logic for managing src\modules\twitch\success operations.
 * Usage: Import relevant methods/functions as required.
 */
require('dotenv').config();
const axios = require('axios');
const { setSecret } = require('../store/manager'); // Import setSecret to store tokens

async function twitchLoginSuccess(req, res) {
    const code = req.query.code; // Retrieve the 'code' parameter from the query string

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

        setSecret('twitch_access_token', accessToken);
        setSecret('twitch_refresh_token', refreshToken);

        // Return a success response
        return res.status(200).json('OAuth tokens retrieved successfully');
    } catch (error) {
        console.error('Error exchanging code for tokens:', error.response?.data || error.message);
        return res.status(500).json('Failed to get OAuth tokens');
    }
}

module.exports = { twitchLoginSuccess };
require('dotenv').config();
const axios = require('axios');
const { setSecret } = require('../store/manager'); // Import setSecret to store tokens
const { publicTwitchSuccess } = require('../../public/twitch/success'); // Import the success page builder

// Function to handle Twitch login success and return a success page
async function twitchLoginSuccess(req, res) {
    const code = req.query.code; // Retrieve the 'code' parameter from the query string

    try {
        // Exchange the code for the OAuth tokens
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

        // Store the access token and refresh token in the .secrets file
        setSecret('access_token', accessToken);
        setSecret('refresh_token', refreshToken);

        console.log('OAuth token response:', response.data);

        // Return the HTML page for the success
        res.send(publicTwitchSuccess());
    } catch (error) {
        console.error('Error exchanging code for tokens:', error.response?.data || error.message);
        res.status(500).send('Failed to get OAuth tokens');
    }
}

module.exports = { twitchLoginSuccess };

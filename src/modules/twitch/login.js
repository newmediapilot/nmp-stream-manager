/**
 * File: src\modules\twitch\login.js
 * Description: This file contains logic for managing src\modules\twitch\login operations.
 * Usage: Import relevant methods/functions as required.
 */
require('dotenv').config(); // Load environment variables from .env
const axios = require('axios');
const chalk = require('chalk'); // Import chalk for colorized logs
const {getSecret, setSecret, getParam, setParam} = require('../store/manager');

function twitchLogin(req, res) {
    const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
    const TWITCH_SCOPES = process.env.TWITCH_SCOPES || "clips:edit user:write:chat";
    const TWITCH_REDIRECT_URL = process.env.TWITCH_REDIRECT_URL;

    console.log(chalk.green('TWITCH_CLIENT_ID:'), chalk.cyan(TWITCH_CLIENT_ID));
    console.log(chalk.green('TWITCH_SCOPES:'), chalk.cyan(TWITCH_SCOPES));
    console.log(chalk.green('TWITCH_REDIRECT_URL:'), chalk.cyan(TWITCH_REDIRECT_URL));
    console.log(chalk.green('TWITCH_REDIRECT_URL:'), chalk.cyan(req.referrer));

    // Store referrer for later
    setParam('twitch_login_referrer', '/public/settings');

    const oauthUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${TWITCH_CLIENT_ID}&redirect_uri=${encodeURIComponent(TWITCH_REDIRECT_URL)}&response_type=code&scope=${TWITCH_SCOPES}`;

    console.log(chalk.yellow('OAuth URL generated:'), chalk.blue(oauthUrl));

    res.redirect(oauthUrl); // Redirect the user to the Twitch login URL
}


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

        // Set broadcaster ID for other ops
        await getBroadcasterId();

        // Jump to next referrer if its set
        const referrer = getParam('twitch_login_referrer');
        if(referrer) {
            setParam('twitch_login_referrer', undefined);
            return res.redirect(referrer)
        }

        // Return a success response
        return res.status(200).json('OAuth tokens retrieved successfully');

    } catch (error) {
        console.error('Error exchanging code for tokens:', error.response?.data || error.message);
        return res.status(error.status).json('Failed to get OAuth tokens');
    }
}

async function getBroadcasterId() {
    try {
        const username = getParam('twitch_username');

        const accessToken = getSecret('twitch_access_token'); // Get the access token from setParam
        console.log(chalk.green('Access Token:'), chalk.cyan(accessToken));
        const response = await axios.get(`https://api.twitch.tv/helix/users?login=${username}`, {
            headers: {
                'Client-ID': process.env.TWITCH_CLIENT_ID,
                Authorization: `Bearer ${accessToken}`, // Use the access token here
            },
        });

        if (response.data.data && response.data.data.length > 0) {
            const broadcasterId = response.data.data[0].id;
            console.log(chalk.green('Broadcaster ID fetched:'), chalk.cyan(broadcasterId));
            setSecret('twitch_broadcaster_id', broadcasterId);
            return broadcasterId; // Return the broadcaster ID
        } else {
            setSecret('twitch_broadcaster_id', undefined);
            throw new Error('No broadcaster found');
        }
    } catch (error) {
        setSecret('twitch_broadcaster_id', undefined);
        console.error(chalk.red('Error fetching broadcaster ID:'), chalk.redBright(error));
        return false;
    }
}

module.exports = {twitchLogin, twitchLoginSuccess, getBroadcasterId};

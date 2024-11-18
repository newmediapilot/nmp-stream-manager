/**
 * File: src\modules\twitch\login.js
 * Description: This file contains logic for managing src\modules\twitch\login operations.
 * Usage: Import relevant methods/functions as required.
 */
require('dotenv').config(); // Load environment variables from .env
const axios = require('axios');
const chalk = require('chalk'); // Import chalk for colorized logs
const { getSecret } = require('../store/manager');

function twitchLogin(req, res) {
    const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
    const TWITCH_SCOPES = process.env.TWITCH_SCOPES;
    const TWITCH_REDIRECT_URL = process.env.TWITCH_REDIRECT_URL;

    console.log(chalk.green('TWITCH_CLIENT_ID:'), chalk.cyan(TWITCH_CLIENT_ID));
    console.log(chalk.green('TWITCH_SCOPES:'), chalk.cyan(TWITCH_SCOPES));
    console.log(chalk.green('TWITCH_REDIRECT_URL:'), chalk.cyan(TWITCH_REDIRECT_URL));

    const oauthUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${TWITCH_CLIENT_ID}&redirect_uri=${encodeURIComponent(TWITCH_REDIRECT_URL)}&response_type=code&scope=${TWITCH_SCOPES}`;

    console.log(chalk.yellow('OAuth URL generated:'), chalk.blue(oauthUrl));

    res.redirect(oauthUrl); // Redirect the user to the Twitch login URL
}

async function getBroadcasterId(username) {
    try {
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
            return broadcasterId; // Return the broadcaster ID
        } else {
            throw new Error('No broadcaster found');
        }
    } catch (error) {
        console.error(chalk.red('Error fetching broadcaster ID:'), chalk.redBright(error));
        throw error;
    }
}

module.exports = { twitchLogin, getBroadcasterId };

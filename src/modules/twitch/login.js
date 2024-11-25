/**
 * File: src\modules\twitch\login.js
 * Description: This file contains logic for managing src\modules\twitch\login operations.
 * Usage: Import relevant methods/functions as required.
 */

const axios = require('axios');
const chalk = require('chalk'); // Import chalk for colorized logs
const {getSecret, setSecret, getParam, setParam, resetSecrets} = require('../store/manager');
const {twitchCommandSetup} = require('./configure');

/**
 * Initiates the login flow
 * @param req
 * @param res
 */
function twitchLogin(req, res) {

    const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
    const TWITCH_SCOPES = process.env.TWITCH_SCOPES || "clips:edit user:write:chat";
    const TWITCH_REDIRECT_URL = process.env.TWITCH_REDIRECT_URL;

    console.log(chalk.blueBright('twitchLogin start...'));
    console.log(chalk.green('TWITCH_SCOPES:'), chalk.cyan(TWITCH_SCOPES));
    console.log(chalk.green('TWITCH_REDIRECT_URL:'), chalk.cyan(TWITCH_REDIRECT_URL));

    // Store referrer for later
    setParam('twitch_login_referrer', '/public/settings');

    const oauthUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${TWITCH_CLIENT_ID}&redirect_uri=${encodeURIComponent(TWITCH_REDIRECT_URL)}&response_type=code&scope=${TWITCH_SCOPES}`;

    console.log(chalk.yellow('OAuth URL generated:'), chalk.blue(oauthUrl));

    res.redirect(oauthUrl); // Redirect the user to the Twitch login URL
}

/**
 * Redirected here from Twitch on login success
 * We perform a series of post-connection fetches and configs
 * @param req
 * @param res
 * @returns {Promise<*|void|Response>}
 */
async function twitchLoginSuccess(req, res) {

    resetSecrets();

    const code = req.query.code;

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

        await getBroadcasterId();
        await getChannelId();
        await twitchCommandSetup();

        const referrer = getParam('twitch_login_referrer');

        if (referrer) {
            setParam('twitch_login_referrer', undefined);
            return res.redirect(referrer)
        }

        return res.status(200).json('OAuth tokens retrieved successfully');

    } catch (error) {
        console.error('Error exchanging code for tokens:', error.response?.data || error.message);
        return res.status(error.status).json('Failed to get OAuth tokens');
    }
}

/**
 * Gets the broadcaster id for the Twitch API
 * @returns {Promise<boolean|*>}
 */
async function getBroadcasterId() {
    try {
        const username = getParam('twitch_username');

        const accessToken = getSecret('twitch_access_token'); // Get the access token from setParam
        console.log(chalk.green('Access Token:'), chalk.cyan(String('X').repeat(accessToken.length)));
        const response = await axios.get(`https://api.twitch.tv/helix/users?login=${username}`, {
            headers: {
                'Client-ID': process.env.TWITCH_CLIENT_ID,
                Authorization: `Bearer ${accessToken}`, // Use the access token here
            },
        });

        if (response.data.data && response.data.data.length > 0) {
            const broadcasterId = response.data.data[0].id;
            console.log(chalk.green('Broadcaster ID fetched:'), chalk.cyan(String('X').repeat(broadcasterId.length)));
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

/**
 * Fetches the Broadcaster's Channel ID (Twitch username/login)
 * @returns {Promise<string|boolean>} - The broadcaster's channel ID or `false` on failure
 */
async function getChannelId() {
    try {
        const username = getParam('twitch_username');

        // Fetch access token from secrets
        const accessToken = getSecret('twitch_access_token');

        // Make the API request
        const response = await axios.get(`https://api.twitch.tv/helix/users?login=${username}`, {
            headers: {
                'Client-ID': process.env.TWITCH_CLIENT_ID,
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (response.data.data && response.data.data.length > 0) {
            const channelId = response.data.data[0].login; // Fetch the broadcaster's channel ID
            console.log(chalk.green('Channel ID fetched:'), chalk.cyan(channelId));
            setSecret('twitch_channel_id', channelId); // Save it for later use
            return channelId; // Return the channel ID
        } else {
            setSecret('twitch_channel_id', undefined);
            throw new Error('No channel found');
        }
    } catch (error) {
        setSecret('twitch_channel_id', undefined);
        console.error(chalk.red('Error fetching Channel ID:'), chalk.redBright(error));
        return false;
    }
}

module.exports = {twitchLogin, twitchLoginSuccess, getBroadcasterId};

/**
 * File: src\modules\twitch\clip.js
 * Description: This file contains logic for managing src\modules\twitch\clip operations.
 * Usage: Import relevant methods/functions as required.
 */
require('dotenv').config(); // Load environment variables from .env
const axios = require('axios');
const {twitchCommandHeaderValidate} = require('./commands');
const {getBroadcasterId} = require('./login'); // Import the getBroadcasterId to access stored params
const {getSecret} = require('../store/manager'); // Import getSecret to fetch the access token

/**
 * Attempts to create a clip on twitch
 * @param req
 * @param res
 * @returns {Promise<TwitterResponse<any>|*|void>}
 */
async function twitchClipCreate(req, res) {
    try {

        const accessToken = getSecret('twitch_access_token');

        if (!accessToken) {
            return res.status(400).json('Access token is missing. Please authenticate first.');
        }

        const broadcasterId = await getBroadcasterId(process.env.TWITCH_USERNAME);

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

        return res.status(response.status).send(`Clip created: ${clipUrl}`);// Return the clip URL
    } catch (error) {
        console.error('Error creating clip:', error.response?.data || error.message);

        if (error.response?.data?.message === 'Clipping is not possible for an offline channel.') {
            return res.status(404).send('Clipping is not possible for an offline channel. Please make sure the channel is online and try again.');
        }

        return res.status(error.status).send(`Failed to create clip`);
    }
}

module.exports = {twitchClipCreate};
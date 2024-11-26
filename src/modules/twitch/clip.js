/**
 * File: src\modules\twitch\clip.js
 * Description: This file contains logic for managing src\modules\twitch\clip operations.
 * Usage: Import relevant methods/functions as required.
 */

const axios = require('axios');
const {twitchMarkerCreate} = require('./marker');
const {setBroadcastTitle} = require('./broadcast');
const {getSecret} = require('../store/manager')

// Timeout before next action
const TIMEOUT_WAIT = 2000;

/**
 * Attempts to create a clip on twitch
 * If query.description is provided it will be used to also create a marker
 * @param req
 * @param res
 * @returns {Promise<TwitterResponse<any>|*|void>}
 */
async function twitchClipCreate(description) {

    try {
        const accessToken = getSecret('twitch_access_token');
        const broadcasterId = getSecret('twitch_broadcaster_id');

        if (!broadcasterId || !accessToken) return res.send('Please authenticate first.');

        // Conditional based on req.query.description param
        await twitchMarkerCreate(description);
        await setBroadcastTitle(description);

        await new Promise(r => setTimeout(r, TIMEOUT_WAIT));

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

        const clipId = response.data.data[0].id;
        const clipUrl = `https://clips.twitch.tv/${clipId}`;

        console.log(`Clip created: ${clipUrl}`);

        return true;

    } catch (error) {
        console.log(`Failed to create clip. ${404 === error.status ? "You appear to be offline." : error.message}`);
        return false;
    }
}

module.exports = {twitchClipCreate};
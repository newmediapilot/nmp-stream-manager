const axios = require('axios');
const chalk = require('chalk');
const { getSecret } = require('../store/manager');

/**
 * Creates a marker on a Twitch stream.
 * @param {string} description - The description of the marker.
 * @returns {boolean} - True if the marker was created successfully, otherwise false.
 */
async function twitchMarkerCreate(description) {
    try {
        const accessToken = getSecret('twitch_access_token');
        const broadcasterId = getSecret('twitch_broadcaster_id');

        console.log(chalk.green('Creating marker:'), chalk.cyan(description));

        const response = await axios.post(
            `https://api.twitch.tv/helix/streams/markers`,
            {
                user_id: broadcasterId,
                description,
            },
            {
                headers: {
                    'Client-Id': process.env.TWITCH_CLIENT_ID,
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        console.log(
            chalk.green.bold('Marker created successfully:'),
            chalk.cyan(`"${response.data.data[0]?.description || 'No description'}"`)
        );
        return true;

    } catch (error) {
        console.log(chalk.red('Error creating marker:'), error.response?.data || error.message);
        return false;
    }
}

module.exports = { twitchMarkerCreate };

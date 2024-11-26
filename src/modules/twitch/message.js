
const axios = require('axios');
const chalk = require('chalk');
const { getSecret } = require('../store/manager');

/**
 * Sends a message to a Twitch channel.
 * @param {string} message - The message to send to the Twitch channel.
 * @returns {boolean} - True if the message was sent successfully, otherwise false.
 */
async function twitchMessageCreate(message) {

    try {
        const accessToken = getSecret('twitch_access_token');
        const broadcasterId = getSecret('twitch_broadcaster_id');

        console.log2(process.cwd(),'Sending message:', message);

        const response = await axios.post(
            `https://api.twitch.tv/helix/chat/messages`, // Replace with actual Twitch API endpoint
            {
                broadcaster_id: broadcasterId,
                sender_id: broadcasterId,
                message,
                color: 'purple',
            },
            {
                headers: {
                    'Client-Id': process.env.TWITCH_CLIENT_ID,
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        console.log2(process.cwd(),'Message sent successfully:', message);
        return true;

    } catch (error) {
        console.log2(process.cwd(),chalk.red('Error sending message:'), error.response?.data || error.message);
        return false;
    }
}

module.exports = { twitchMessageCreate };
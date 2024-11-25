
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

        console.log(chalk.green('Sending message:'), chalk.cyan(message));

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

        console.log(chalk.green.bold('Message sent successfully:'), chalk.cyan(`"${message}"`));
        return true;

    } catch (error) {
        console.error(chalk.red('Error sending message:'), error.response?.data || error.message);
        return false;
    }
}

module.exports = { twitchMessageCreate };
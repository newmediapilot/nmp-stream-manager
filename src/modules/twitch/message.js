require('dotenv').config();
const axios = require('axios');
const { getSecret } = require('../store/manager');
const ROUTES = require('../../routes');

/**
 * Sends a message to a Twitch channel.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
async function twitchMessageCreate(req, res) {
    try {
        const accessToken = getSecret('access_token');
        if (!accessToken) {
            console.warn('Access token is missing.');
            return res.redirect(ROUTES.TWITCH_LOGIN);
        }

        // Retrieve the message from the query string
        const message = req.query.message || 'Hello from Twitch API!'; // Default message if not provided

        if (!message.trim()) {
            return res.status(400).send('Message parameter is required.');
        }

        const channelId = process.env.TWITCH_CHANNEL_ID; // Example: Replace with actual channel ID logic

        const response = await axios.post(
            `https://api.twitch.tv/helix/chat/messages`, // Replace with actual Twitch API endpoint
            {
                channel_id: channelId,
                content: message,
            },
            {
                headers: {
                    'Client-ID': process.env.TWITCH_CLIENT_ID,
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        res.send(`Message sent successfully: "${message}"`);
    } catch (error) {
        console.error('Error sending message:', error.response?.data || error.message);
        res.status(500).send('Failed to send message.');
    }
}

module.exports = { twitchMessageCreate };

require('dotenv').config();
const axios = require('axios');
const { getSecret } = require('../store/manager');
const {getBroadcasterId} = require('./login');

const ROUTES = require('../../routes');
/**
 * Sends a message to a Twitch channel.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
async function twitchMessageCreate(req, res) {
    try {
        const accessToken = getSecret('twitch_access_token');

        // Retrieve the message from the query string
        const message = req.query.message || 'Hello from Twitch API!'; // Default message if not provided

        if (!message.trim()) {
            return res.status(400).send('Message parameter is required.');
        }

        const broadcasterId = await getBroadcasterId(process.env.TWITCH_USERNAME);

        const response = await axios.post(
            `https://api.twitch.tv/helix/chat/messages`, // Replace with actual Twitch API endpoint
            {
                broadcaster_id: broadcasterId,
                sender_id: broadcasterId,
                message,
                "color": "purple"
            },
            {
                headers: {
                    'Client-Id': process.env.TWITCH_CLIENT_ID,
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return res.status(200).send(`Message sent successfully: "${message}"`);
    } catch (error) {
        console.error('Error sending message:', error.response?.data || error.message);
        return res.status(500).send('Failed to send message.');
    }
}

module.exports = { twitchMessageCreate };

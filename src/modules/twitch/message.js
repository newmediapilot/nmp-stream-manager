require('dotenv').config();
const axios = require('axios');
const {getParam, getSecret} = require('../store/manager');

/**
 * Sends a message to a Twitch channel.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
async function twitchMessageCreate(req, res) {

    try {

        // if (getParam('twitch_channel_headers_set')) {
        //     const headers = getSecret('twitch_channel_headers');
        //     Object.keys(headers).forEach(key => {
        //         console.log(`Header: ${key} : ${headers[key]} ~ ${req.headers[key]}`);
        //     });
        // }

        const accessToken = getSecret('twitch_access_token');
        const broadcasterId = getSecret('twitch_broadcaster_id');
        const message = req.query.message;

        if (!message.trim()) {
            return res.status(400).json('Message parameter is required.');
        }

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
        return res.status(response.status).json(`Message sent successfully: "${message}"`);
    } catch (error) {
        console.error('Error sending message:', error.response?.data || error.message);
        return res.status(error.status).json('Failed to send message.');
    }
}

module.exports = {twitchMessageCreate};

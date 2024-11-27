/**
 * File: src/modules/test/signal.js
 * Description: Handles the creation of test signals for Twitch chat. Accepts a description parameter to identify the command
 * and sends a predefined message to Twitch chat via the Twitch API.
 * @returns {void} - Sends a message to Twitch chat and returns a success or failure response.
 * @method testSignalCreate(req, res) - Processes the signal creation based on the description parameter.
 *   @param {object} req - The HTTP request object containing the query parameter `description`.
 *   @param {object} res - The HTTP response object used to send the response.
 */

const { twitchMessageCreate } = require("../twitch/message");

// Predefined messages for commands
const SIGNAL_COMMANDS = {
    "#clip": "#clip Testing #clip command!",
    "#test": "#test Running a #test signal!",
    "#twip": "#twip This is the #twip command!",
    "#mark": "#mark This is the #mark command!",
};

async function testSignalCreate(req, res) {
    const description = req.query.description;

    console.log('req.query.description', req.query.description);

    // Validate the description
    if (!description) {
        return res.status(400).send("Missing parameter. " + description);
    }
    if (!SIGNAL_COMMANDS[description]) {
        return res.status(400).send("Invalid parameter. " + description);
    }

    // Retrieve the corresponding message
    const message = SIGNAL_COMMANDS[description];

    // Send the message to Twitch chat
    const success = await twitchMessageCreate(message);

    // Respond with success or failure
    if (success) {
        res.send(`Signal "${description}" sent to Twitch chat successfully.`);
    } else {
        res.status(500).send(`Failed to send signal "${description}" to Twitch chat.`);
    }
}

module.exports = { testSignalCreate };

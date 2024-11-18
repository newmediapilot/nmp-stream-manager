/**
 * File: src/modules/twitch/commands.js
 * Description: This file contains logic for managing chat commands.
 * Usage: Export the constants and methods to use elsewhere in the application.
 */
const { getParam } = require('../store/manager');
const ROUTES = require('../../routes');
const axios = require('axios');

/**
 * Generates custom API command URLs for all Twitch commands.
 * @returns {object} - An object with all commands mapped to their composed URLs.
 */
function getCommands() {
    const publicUrl = getParam('public_url');

    if (!publicUrl) {
        throw new Error('Public URL is not set. Please initialize the application correctly.');
    }

    // Compose the commands
    return {
        tweet: {
            description: `Adds command "/tweet tweet_message" to chat bot`,
            remove: `!command remove tweet`,
            add: `!command add tweet $(customapi.${publicUrl}${ROUTES.TWITTER_TWEET}?tweet_message=$(1:))`
        },
        clip: {
            description: `Adds command "/clip" to chat bot`,
            remove: `!command remove clip`,
            add: `!command add clip $(customapi.${publicUrl}${ROUTES.TWITCH_CLIP_CREATE})`
        }
    };
}

/**
 * Creates or updates a Twitch command by removing the old one and adding a new one.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
async function createCommand(req, res) {
    try {
        const commands = getCommands();
        const commandKey = req.query.command;

        if (!commandKey || !commands[commandKey]) {
            return res.status(400).json({ success: false, message: 'Invalid or missing command.' });
        }

        const { remove, add } = commands[commandKey];

        // API endpoint for creating Twitch messages
        const apiEndpoint = `${ROUTES.TWITCH_MESSAGE_CREATE}`;

        // Step 1: Remove the existing command
        const removeResponse = await axios.get(apiEndpoint, {
            params: { message: remove }
        });

        if (removeResponse.status !== 200) {
            return res.status(500).json({
                success: false,
                message: `Failed to remove command: ${removeResponse.statusText}`
            });
        }

        // Step 2: Add the new command
        const addResponse = await axios.get(apiEndpoint, {
            params: { message: add }
        });

        if (addResponse.status !== 200) {
            return res.status(500).json({
                success: false,
                message: `Failed to add command: ${addResponse.statusText}`
            });
        }

        // Success
        return res.status(200).json({ success: true, message: `Command '${commandKey}' updated successfully.` });
    } catch (error) {
        console.error('Error in createCommand:', error);
        return res.status(500).json({ success: false, message: 'An error occurred while updating the command.' });
    }
}

module.exports = { getCommands, createCommand };

const { getParam } = require('../store/manager');
const ROUTES = require('../../routes');
const axios = require('axios');

/**
 * Retrieves all available Twitch commands.
 * @returns {object} - An object with all commands mapped to their composed URLs.
 */
function twitchCommandsGet() {
    const publicUrl = getParam('public_url');

    if (!publicUrl) {
        throw new Error('Public URL is not set. Please initialize the application correctly.');
    }

    return {
        tweet: {
            description: `Adds command "/tweet tweet_message" to chat bot`,
            remove: `!command remove tweet`,
            add: `!command add tweet $(customapi.${publicUrl}${ROUTES.TWITTER_TWEET}?tweet_message=$(1:))`,
        },
        clip: {
            description: `Adds command "/clip" to chat bot`,
            remove: `!command remove clip`,
            add: `!command add clip $(customapi.${publicUrl}${ROUTES.TWITCH_CLIP_CREATE})`,
        },
    };
}

/**
 * Handles the removal of a Twitch command.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
async function twitchCommandRemove(req, res) {
    try {
        const commandKey = req.query.command;
        const commands = twitchCommandsGet();

        if (!commandKey || !commands[commandKey]) {
            return res.status(400).json({ success: false, message: 'Invalid or missing command.' });
        }

        const removeMessage = commands[commandKey].remove;
        console.log(`Removing Twitch command: ${removeMessage}`);

        // Simulate successful removal (or implement actual logic here)
        return res.status(200).json({
            success: true,
            message: `Command removed: ${removeMessage}`,
        });
    } catch (error) {
        console.error('Error in twitchCommandRemove:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while removing the command.',
        });
    }
}

/**
 * Creates or updates a Twitch command by removing the old one and adding a new one.
 * Uses `twitchCommandRemove` to handle the removal process.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
async function twitchCommandCreate(req, res) {
    try {
        const commandKey = req.query.command;
        const commands = twitchCommandsGet();

        if (!commandKey || !commands[commandKey]) {
            return res.status(400).json({ success: false, message: 'Invalid or missing command.' });
        }

        const addMessage = commands[commandKey].add;

        // Step 1: Remove the existing command
        const removeResponse = await axios.get(`http://localhost${ROUTES.TWITCH_COMMAND_REMOVE}`, {
            params: { command: commandKey },
        });

        console.log('removeResponse', removeResponse);

        if (removeResponse.status !== 200 || !removeResponse.data.success) {
            return res.status(removeResponse.status).json({
                success: false,
                message: `Failed to remove command: ${removeResponse.data.message || removeResponse.statusText}`,
            });
        }

        console.log(`Command '${commandKey}' removed successfully.`);

        // Step 2: Add the new command
        const addResponse = await axios.get(`http://localhost${ROUTES.TWITCH_MESSAGE_CREATE}`, {
            params: { message: addMessage },
        });

        if (addResponse.status !== 200 || !addResponse.data.success) {
            return res.status(addResponse.status).json({
                success: false,
                message: `Failed to add command: ${addResponse.data.message || addResponse.statusText}`,
            });
        }

        console.log(`Command '${commandKey}' added successfully: ${addMessage}`);

        // If both steps succeed, return a success response
        return res.status(200).json({
            success: true,
            message: `Command '${commandKey}' updated successfully.`,
        });
    } catch (error) {
        console.error('Error in twitchCommandCreate:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while updating the command.',
        });
    }
}

module.exports = { twitchCommandsGet, twitchCommandCreate, twitchCommandRemove };

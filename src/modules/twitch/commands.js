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
async function twitchCommandUnset(req, res) {
    try {
        const commandKey = req.query.command;
        const commands = twitchCommandsGet();

        if (!commandKey || !commands[commandKey]) {
            return res.status(400).json({ success: false, message: 'Invalid or missing command.' });
        }

        const removeMessage = commands[commandKey].remove;
        console.log(`Attempting to unset command: ${commandKey} with message: ${removeMessage}`);

        const removeResponse = await axios.get(`http://localhost${ROUTES.TWITCH_MESSAGE_CREATE}`, {
            params: { message: removeMessage },
        });

        if (removeResponse.status !== 200) {
            console.error('Error in removeResponse:', {
                status: removeResponse.status,
                data: removeResponse.data,
            });
            return res.status(removeResponse.status).json({
                success: false,
                message: `Failed to unset command: ${removeResponse.data.message || removeResponse.statusText}`,
            });
        }

        console.log(`Command unset successfully: ${commandKey}`);
        return res.status(200).json({
            success: true,
            message: `Command unset successfully: ${removeMessage}`,
        });
    } catch (error) {
        console.error('Error in twitchCommandUnset:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while unsetting the command.',
        });
    }
}

/**
 * Handles the adding of a Twitch command.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
async function twitchCommandSet(req, res) {
    try {
        const commandKey = req.query.command;
        const commands = twitchCommandsGet();

        if (!commandKey || !commands[commandKey]) {
            return res.status(400).json({ success: false, message: 'Invalid or missing command.' });
        }

        const addMessage = commands[commandKey].add;
        console.log(`Attempting to set command: ${commandKey} with message: ${addMessage}`);

        const addResponse = await axios.get(`http://localhost${ROUTES.TWITCH_MESSAGE_CREATE}`, {
            params: { message: addMessage },
        });

        if (addResponse.status !== 200) {
            console.error('Error in addResponse:', {
                status: addResponse.status,
                data: addResponse.data,
            });
            return res.status(addResponse.status).json({
                success: false,
                message: `Failed to set command: ${addResponse.data.message || addResponse.statusText}`,
            });
        }

        console.log(`Command set successfully: ${commandKey}`);
        return res.status(200).json({
            success: true,
            message: `Command set successfully: ${addMessage}`,
        });
    } catch (error) {
        console.error('Error in twitchCommandSet:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while setting the command.',
        });
    }
}

/**
 * Creates or updates a Twitch command by removing the old one and adding a new one.
 * Uses `twitchCommandUnset` to handle the removal process.
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

        // Step 1: Remove the existing command
        console.log(`Starting command creation. Unsetting command: ${commandKey}`);
        const removeResponse = await axios.get(`http://localhost${ROUTES.TWITCH_COMMAND_UNSET}`, {
            params: { command: commandKey },
        });

        if (removeResponse.status !== 200) {
            console.error('Error in removeResponse during twitchCommandCreate:', {
                status: removeResponse.status,
                data: removeResponse.data,
            });
            return res.status(400).json({
                success: false,
                message: `Command '${commandKey}' unset failed.`,
            });
        }

        // Wait for command manually, actual removal is async from here
        await new Promise(resolve => setTimeout(resolve, 500));

        // Step 2: Add the new command
        console.log(`Unsetting command completed. Setting new command: ${commandKey}`);
        const addResponse = await axios.get(`http://localhost${ROUTES.TWITCH_COMMAND_SET}`, {
            params: { command: commandKey },
        });

        if (addResponse.status !== 200) {
            console.error('Error in addResponse during twitchCommandCreate:', {
                status: addResponse.status,
                data: addResponse.data,
            });
            return res.status(400).json({
                success: false,
                message: `Command '${commandKey}' set failed.`,
            });
        }

        console.log(`Command '${commandKey}' created successfully.`);
        return res.status(200).json({
            success: true,
            message: `Command '${commandKey}' created successfully.`,
        });
    } catch (error) {
        console.error('Error in twitchCommandCreate:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while creating the command.',
        });
    }
}

module.exports = {
    twitchCommandsGet,
    twitchCommandCreate,
    twitchCommandSet,
    twitchCommandUnset,
};

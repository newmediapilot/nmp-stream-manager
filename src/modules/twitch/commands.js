const { getParam } = require('../store/manager');
const ROUTES = require('../../routes');
const axios = require('axios');

// Timeout before next action
const TIMEOUT_WAIT = 2000;

/**
 * Creates or updates a Twitch command by removing the old one and adding a new one.
 * Uses `twitchCommandUnset` to handle the removal process.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
async function twitchCommandCreate(req, res) {
    try {

        const commands = twitchCommandsGet();
        const commandKey = req.query.command;

        if (!commandKey || !commands[commandKey]) {
            return res.status(400).json({ success: false, message: 'Invalid or missing command.' });
        }

        // Step 1: Remove the existing command
        console.log(`Starting command creation. Unsetting command: ${commandKey}`);

        const unsetResponse = await axios.get(`http://localhost${ROUTES.TWITCH_COMMAND_UNSET}`, {
            params: { command: commandKey },
        });

        if (unsetResponse.status !== 200) {
            console.error('Error in unsetResponse during twitchCommandCreate:', {
                status: unsetResponse.status,
                data: unsetResponse.data,
            });
            return res.status(unsetResponse.status).json({
                success: false,
                message: `Command '${commandKey}' unset failed.`,
            });
        }

        // Wait for command manually, actual removal is async from here
        await new Promise(resolve => setTimeout(resolve, TIMEOUT_WAIT));

        // Step 2: Add the new command
        console.log(`Unsetting command completed. Setting new command: ${commandKey}`);
        const setResponse = await axios.get(`http://localhost${ROUTES.TWITCH_COMMAND_SET}`, {
            params: { command: commandKey },
        });

        if (setResponse.status !== 200) {
            console.error('Error in setResponse during twitchCommandCreate:', {
                status: setResponse.status,
                data: setResponse.data,
            });
            return res.status(setResponse.status).json({
                success: false,
                message: `Command '${commandKey}' set failed.`,
            });
        }

        // Wait for command again before allowing next push
        await new Promise(resolve => setTimeout(resolve, TIMEOUT_WAIT));

        console.log(`Command '${commandKey}' created successfully.`);
        return res.status(setResponse.status).json({
            success: true,
            message: `Command '${commandKey}' created successfully.`,
        });
    } catch (error) {
        console.error('Error in twitchCommandCreate:', error.message);

        return res.status(error.status).json({
            success: false,
            message: 'An error occurred while creating the command.',
        });
    }
}

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

        const unsetResponse = await axios.get(`http://localhost${ROUTES.TWITCH_MESSAGE_CREATE}`, {
            params: { message: removeMessage },
        });

        if (unsetResponse.status !== 200) {
            console.error('Error in unsetResponse:', {
                status: unsetResponse.status,
                data: unsetResponse.data,
            });
            return res.status(unsetResponse.status).json({
                success: false,
                message: `Failed to unset command: ${unsetResponse.data.message || unsetResponse.statusText}`,
            });
        }

        console.log(`Command unset successfully: ${commandKey}`);
        return res.status(unsetResponse.status).json({
            success: true,
            message: `Command unset successfully: ${removeMessage}`,
        });
    } catch (error) {
        console.error('Error in twitchCommandUnset:', error.message);
        return res.status(error.status).json({
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

        const setResponse = await axios.get(`http://localhost${ROUTES.TWITCH_MESSAGE_CREATE}`, {
            params: { message: addMessage },
        });

        if(setResponse.status === 401){
            console.log(`setResponse.status`, setResponse.status);
        }

        if (setResponse.status !== 200) {
            console.error('Error in setResponse:', {
                status: setResponse.status,
                data: setResponse.data,
            });
            return res.status(setResponse.status).json({
                success: false,
                message: `Failed to set command: ${setResponse.data.message || setResponse.statusText}`,
            });
        }

        console.log(`Command set successfully: ${commandKey}`);
        return res.status(setResponse.status).json({
            success: true,
            message: `Command set successfully: ${addMessage}`,
        });
    } catch (error) {
        console.error('Error in twitchCommandSet:', error.message);
        return res.status(error.status).json({
            success: false,
            message: 'An error occurred while setting the command.',
        });
    }
}

module.exports = {
    twitchCommandsGet,
    twitchCommandCreate,
    twitchCommandSet,
    twitchCommandUnset,
};

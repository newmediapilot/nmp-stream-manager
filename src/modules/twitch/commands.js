const { getParam, hasSecret, setSecret } = require('../store/manager');
const ROUTES = require('../../routes');
const axios = require('axios');
const chalk = require('chalk');

// Timeout before next action
const TIMEOUT_WAIT = 2000;

/**
 * Retrieves all available Twitch commands.
 * @returns {object} - An object with all commands mapped to their composed URLs.
 */
function twitchCommandsGet() {
    const publicUrl = getParam('public_url');

    if (!publicUrl) throw new Error(chalk.red.bold('Public URL is not set. Please initialize the application correctly.'));

    return {
        configure: {
            description: `Adds command "/configure" to chat bot`,
            remove: `!command remove configure`,
            add: `!command add configure $(customapi.${publicUrl}${ROUTES.TWITCH_MESSAGE_CONFIGURE})`,
        },
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
 * Creates or updates a Twitch command by removing the old one and adding a new one.
 */
async function twitchCommandCreate(req, res) {
    try {
        const commands = twitchCommandsGet();
        const commandKey = req.query.command;

        if (!commandKey || !commands[commandKey]) {
            console.log(chalk.red('Invalid or missing command.'));
            return res.status(400).json({ success: false, message: 'Invalid or missing command.' });
        }

        console.log(chalk.blue(`Starting command creation. Unsetting command: ${chalk.cyan(commandKey)}`));

        const unsetResponse = await axios.get(`http://localhost${ROUTES.TWITCH_COMMAND_UNSET}`, {
            params: { command: commandKey },
        });

        if (unsetResponse.status !== 200) {
            console.error(chalk.red('Error in unsetResponse during twitchCommandCreate:'), unsetResponse.data);
            return res.status(unsetResponse.status).send({
                success: false,
                message: `Command '${commandKey}' unset failed.`,
            });
        }

        await new Promise(resolve => setTimeout(resolve, TIMEOUT_WAIT));

        console.log(chalk.green(`Unsetting command completed. Setting new command: ${chalk.cyan(commandKey)}`));

        const setResponse = await axios.get(`http://localhost${ROUTES.TWITCH_COMMAND_SET}`, {
            params: { command: commandKey },
        });

        if (setResponse.status !== 200) {
            console.error(chalk.red('Error in setResponse during twitchCommandCreate:'), setResponse.data);
            return res.status(setResponse.status).json({
                success: false,
                message: `Command '${commandKey}' set failed.`,
            });
        }

        await new Promise(resolve => setTimeout(resolve, TIMEOUT_WAIT));

        console.log(chalk.green.bold(`Command '${commandKey}' created successfully.`));
        return res.status(setResponse.status).json({
            success: true,
            message: `Command '${commandKey}' created successfully.`,
        });
    } catch (error) {
        console.error(chalk.red('Error in twitchCommandCreate:'), error.message);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while creating the command.',
        });
    }
}

/**
 * Handles the removal of a Twitch command.
 */
async function twitchCommandUnset(req, res) {
    try {
        const commandKey = req.query.command;
        const commands = twitchCommandsGet();

        if (!commandKey || !commands[commandKey]) {
            console.log(chalk.red('Invalid or missing command.'));
            return res.status(400).json({
                success: false,
                message: 'Invalid or missing command.',
            });
        }

        const removeMessage = commands[commandKey].remove;
        console.log(chalk.yellow(`Attempting to unset command: ${chalk.cyan(commandKey)} with message: ${chalk.magenta(removeMessage)}`));

        const unsetResponse = await axios.get(`http://localhost${ROUTES.TWITCH_MESSAGE_CREATE}`, {
            params: { message: removeMessage },
        });

        if (unsetResponse.status !== 200) {
            console.error(chalk.red('Error in unsetResponse:'), unsetResponse.data);
            return res.status(unsetResponse.status).json({
                success: false,
                message: `Failed to unset command: ${unsetResponse.data.message || unsetResponse.statusText}`,
            });
        }

        console.log(chalk.green(`Command unset successfully: ${chalk.cyan(commandKey)}`));
        return res.status(unsetResponse.status).json({
            success: true,
            message: `Command unset successfully: ${removeMessage}`,
        });
    } catch (error) {
        console.error(chalk.red('Error in twitchCommandUnset:'), error.message);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while unsetting the command.',
        });
    }
}

/**
 * Handles the adding of a Twitch command.
 */
async function twitchCommandSet(req, res) {
    try {
        const commandKey = req.query.command;
        const commands = twitchCommandsGet();

        if (!commandKey || !commands[commandKey]) {
            console.log(chalk.red('Invalid or missing command.'));
            return res.status(400).json({ success: false, message: 'Invalid or missing command.' });
        }

        const addMessage = commands[commandKey].add;
        console.log(chalk.yellow(`Attempting to set command: ${chalk.cyan(commandKey)} with message: ${chalk.magenta(addMessage)}`));

        const setResponse = await axios.get(`http://localhost${ROUTES.TWITCH_MESSAGE_CREATE}`, {
            params: { message: addMessage },
        });

        if (setResponse.status !== 200) {
            console.error(chalk.red('Error in setResponse:'), setResponse.data);
            return res.status(setResponse.status).json({
                success: false,
                message: `Failed to set command: ${setResponse.data.message || setResponse.statusText}`,
            });
        }

        console.log(chalk.green(`Command set successfully: ${chalk.cyan(commandKey)}`));
        return res.status(setResponse.status).json({
            success: true,
            message: `Command set successfully: ${addMessage}`,
        });
    } catch (error) {
        console.error(chalk.red('Error in twitchCommandSet:'), error.message);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while setting the command.',
        });
    }
}

/**
 * Pings chat to retrieve headers which we will verify against subsequent requests.
 */
async function twitchMessageConfigureSetup() {
    console.log(chalk.blue('Starting twitchMessageConfigureSetup...'));
    try {
        await axios.get(`http://localhost${ROUTES.TWITCH_COMMAND_CREATE}`, { params: { command: 'configure' } });
        console.log(chalk.green('Setup complete.'));
    } catch (error) {
        console.error(chalk.red('Error in twitchMessageConfigureSetup:'), error.message);
    }
}

/**
 * Used to extract chatbot configuration information.
 */
async function twitchMessageConfigure(req, res) {
    console.log(chalk.blue('Starting twitchMessageConfigure...'));
    if (hasSecret('twitch_channel_headers')) {
        console.log(chalk.yellow('twitchMessageConfigure already set, skipping...'));
        return;
    }

    setSecret('twitch_channel_headers', {
        'host': process.env.NGROK_URL,
        'user-agent': 'StreamElements Bot',
        'cf-connecting-ip': req.headers['cf-connecting-ip'],
        'cf-ray': req.headers['cf-ray'],
        'cf-worker': req.headers['cf-worker'],
        'x-forwarded-host': process.env.NGROK_URL,
        'x-streamelements-channel': req.headers['x-streamelements-channel']
    });

    console.log(chalk.green('twitchMessageConfigure completed successfully.'));
}

module.exports = {
    twitchMessageConfigureSetup,
    twitchMessageConfigure,
    twitchCommandsGet,
    twitchCommandCreate,
    twitchCommandSet,
    twitchCommandUnset,
};

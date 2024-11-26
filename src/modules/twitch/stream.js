const tmi = require('tmi.js');
const chalk = require('chalk');
const { getSecret, setParam } = require('../store/manager');

/**
 * Initializes and starts listening for Twitch chat messages.
 * @returns {Promise<void>}
 */
async function watchMessages() {
    // Get Twitch credentials from secrets
    const token = getSecret('twitch_access_token');
    const channel = getSecret('twitch_channel_id');

    if (!token || !channel) {
        console.log(chalk.redBright('Missing Twitch credentials. Ensure access token and channel ID are set in secrets.'));
        return;
    }

    // Create a new tmi.js client instance
    const client = new tmi.Client({
        options: { debug: true },
        connection: { reconnect: true, secure: true },
        identity: {
            username: channel, // Twitch channel name
            password: `oauth:${token}` // OAuth token
        },
        channels: [channel] // Channel to connect to
    });

    // Connect to Twitch IRC
    client.connect()
        .then(() => console.log(chalk.greenBright(`Connected to Twitch chat for channel: ${channel}`)))
        .catch(err => console.error(chalk.red('Error connecting to Twitch chat:'), err));

    // Listen for chat messages
    client.on('message', (channel, tags, message, self) => {
        if (self) return; // Ignore bot's own messages

        // Log the incoming message
        console.log(chalk.cyanBright(`${tags['display-name']}: ${message}`));

        // Example: Store the message or trigger custom logic
        setParam('last_message', { user: tags['display-name'], message });
    });

    // Handle disconnects
    client.on('disconnected', (reason) => {
        console.log(chalk.yellowBright(`Disconnected from Twitch chat: ${reason}`));
    });
}

module.exports = { watchMessages };

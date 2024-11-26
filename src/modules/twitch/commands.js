const {twitchClipCreate} = require('./clip'); // Import the `twitchClipCreate` function
const {twitchMessageCreate} = require('./message'); // Import the `twitchClipCreate` function

const COMMANDS = {
    '#clip ': twitchClipCreate,
    '#test ': twitchMessageCreate,
};

/**
 * Feeds the command to the appropriate handler.
 * @param {string} command - The extracted command keyword.
 */
async function parseCommand(message) {

    const match = Object.keys(COMMANDS).find(key => message.startsWith(key));

    if (match) {

        const description = message.split(match)[1];

        console.log(`Match: ${match}, Description: ${description}`);

        await COMMANDS[match](description);

    } else {
        console.log('No matching command found', match);
        return false;
    }

}

module.exports = {parseCommand};
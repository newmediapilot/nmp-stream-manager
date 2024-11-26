const {twitchClipCreate} = require('./clip');
const {twitchMessageCreate} = require('./message');

const COMMANDS = {
    '#clip ': twitchClipCreate,
    '#test ': () => twitchMessageCreate('testing beep boop!'),
};

/**
 * Feeds the command to the appropriate handler.
 * @param {string} command - The extracted command keyword.
 */
async function parseCommand(message) {

    console.log('Message: ', message);

    const match = Object.keys(COMMANDS).find(key => message.startsWith(key));

    if ('#test' === message.trim()) {
        await twitchMessageCreate('testing beep boop!');
        return true;
    }

    if (match) {

        const description = message.split(match)[1];
        console.log(`Match: ${match}, Description: ${description}`);
        await COMMANDS[match](description);
        return true;

    } else {
        console.log('No matching command found', match);
        return false;
    }

}

module.exports = {parseCommand};
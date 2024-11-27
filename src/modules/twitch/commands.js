/**
 * File: src\modules\twitch\commands.js
 * Description: Logic and operations for src\modules\twitch\commands.js.
 */
const {getSecret} = require("../store/manager");
const {twitchClipCreate} = require("./clip");
const {twitchTwipCreate} = require("../twip/create");
const {twitterTweet} = require("../twitter/tweet");
const {twitchMessageCreate} = require("./message");
const {twitchMarkerCreate} = require("./marker");

/**
 * Feeds the command to the appropriate handler.
 * @param channel
 * @param tags
 * @param message
 */
async function parseCommand(channel, tags, message) {

    console.log2(process.cwd(), "Message: ", message);

    const isBroadcaster = tags["user-id"] === getSecret("twitch_broadcaster_id");

    const COMMANDS = {
        "test": "test/",
        "clip": "clip/",
        "twip": "twip/",
        "tweet": "tweet/",
        "mark": "mark/",
        "shout": "shout/",
    };

    let currentCommand;
    let currentMessage;

    // Catch command messages
    for (const [key, value] of Object.entries(COMMANDS)) {
        if (message.startsWith(value)) {
            currentCommand = value;
            currentMessage = message.slice(value.length);
            break;
        }
    }

    // Exit early if no commands
    if (!currentCommand) {
        console.warn2(process.cwd(), "Skipping no command found for:", message.substr(0, 20), "...");
        return false;
    } else {
        console.log2(process.cwd(), "Found command:", currentCommand, "with message", currentMessage);
    }

    // Command gauntlet, edit cautiously
    if (isBroadcaster) {
        console.log2(process.cwd(), "BROADCASTER command:", currentCommand, "with message", currentMessage);
        if (currentCommand === COMMANDS.test) await twitchMessageCreate("🤖 Testing beep boop!");
        if (currentCommand === COMMANDS.mark) await twitchMarkerCreate(currentMessage);
        if (currentCommand === COMMANDS.clip) await twitchClipCreate(currentMessage);
        if (currentCommand === COMMANDS.tweet) await twitterTweet(currentMessage);
        if (currentCommand === COMMANDS.twip) await twitchTwipCreate(currentMessage);
        return true;
    } else {
        console.log2(process.cwd(), "VIEWER command:", currentCommand, "with message", currentMessage);

        if (currentCommand === COMMANDS.shout) {
            await twitchMessageCreate("🤖 Check out", );
        }

        // TODO: creates a shoutout
        // TODO: tweets a screenshot
        // TODO: logs heart rate
        return true;
    }
}

module.exports = {parseCommand};

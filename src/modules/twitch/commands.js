/**
 * File: src\modules\twitch\commands.js
 * Description: Logic and operations for src\modules\twitch\commands.js.
 */

const { twitchClipCreate } = require("./clip");
const { twitchTwipCreate } = require("../twip/create");
const { twitterTweet } = require("../twitter/tweet");
const { twitchMessageCreate } = require("./message");
const { twitchMarkerCreate } = require("./marker");

const COMMANDS = {
  "#clip ": twitchClipCreate,
  "#twip ": twitchTwipCreate,
  "#tweet ": twitterTweet,
  "#mark ": twitchMarkerCreate,
  "#test ": () => twitchMessageCreate("testing beep boop!"),
};

/**
 * Feeds the command to the appropriate handler.
 * @param {string} command - The extracted command keyword.
 */
async function parseCommand(message) {
  console.log2(process.cwd(), "Message: ", message);

  const match = Object.keys(COMMANDS).find((key) => message.startsWith(key));

  if ("#test" === message.trim()) {
    await twitchMessageCreate("🤖 Testing beep boop!");
    return true;
  }

  if (match) {
    const splitPoint = match.length;
    const description = message.slice(splitPoint);
    console.log2(process.cwd(), "Match", match, "Description:", description);
    await COMMANDS[match](description);
    return true;
  } else {
    console.err2(
      process.cwd(),
      "No matching command found",
      message,
      "::",
      match,
    );
    return false;
  }
}

module.exports = { parseCommand };

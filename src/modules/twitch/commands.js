/**
 * File: src\modules\twitch\commands.js
 * Description: Logic and operations for src\modules\twitch\commands.js.
 */
const { getSecret } = require("../store/manager");
const { getbpmRateMessage } = require("../sensor/listen");
const { twitchAdCreate } = require("./ads");
const { twitchClipCreate } = require("./clip");
const { twitchTwipCreate } = require("../twip/create");
const { twitterTweet } = require("../twitter/tweet");
const { twitchMessageCreate } = require("./message");
const { twitchMarkerCreate } = require("./marker");
const { setBroadcastTitle } = require("./broadcast");

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
    test: "test/",
    ad: "ad/",
    clip: "clip/",
    twip: "twip/",
    tweet: "tweet/",
    mark: "mark/",
    shout: "shout/",
    title: "title/",
    bpm: "bpm/",
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
    console.warn2(
      process.cwd(),
      "Skipping no command found for:",
      message.substr(0, 20),
      "...",
    );
    return false;
  } else {
    console.log2(
      process.cwd(),
      "Found command:",
      currentCommand,
      "with message",
      currentMessage,
    );
  }

  // Public commands

  if (currentCommand === COMMANDS.shout) {
    const username = currentMessage;
    const twitchURL = `https://twitch.tv/${username}`;
    await twitchMessageCreate(
      `📡 Shoutout to @${username}! Check them out and show them some love: ${twitchURL} 💜`,
    );
    return true;
  }

  if (currentCommand === COMMANDS.bpm) {
    await twitchMessageCreate(getbpmRateMessage());
    return true;
  }

  // Broadcaster commands
  if (isBroadcaster) {
    console.log2(
      process.cwd(),
      "BROADCASTER command:",
      currentCommand,
      "with message",
      currentMessage,
    );

    if (currentCommand === COMMANDS.test) {
      await twitchMessageCreate("🤖 Testing beep boop!");
    }
    if (currentCommand === COMMANDS.ad) {
      await twitchAdCreate(currentMessage);
    }
    if (currentCommand === COMMANDS.mark) {
      await twitchMarkerCreate(currentMessage);
    }
    if (currentCommand === COMMANDS.clip) {
      await twitchClipCreate(currentMessage);
    }
    if (currentCommand === COMMANDS.tweet) {
      await twitterTweet(currentMessage);
    }
    if (currentCommand === COMMANDS.twip) {
      await twitchTwipCreate(currentMessage);
    }
    if (currentCommand === COMMANDS.title) {
      await setBroadcastTitle(currentMessage);
    }

    return true;
  }
}

module.exports = { parseCommand };

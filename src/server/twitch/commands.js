const { getSecret } = require("../store/manager");
const { getBpm } = require("../bpm/listen");
const { twitchAdCreate } = require("./ads");
const { twitchClipCreate } = require("./clip");
const { twitchTwipCreate } = require("../twitter/twip");
const { twitterTweet } = require("../twitter/tweet");
const { twitchMessageCreate } = require("./message");
const { twitchMarkerCreate } = require("./marker");
const { setBroadcastTitle } = require("./broadcast");
async function parseCommand(channel, tags, message) {
  console.log( "Message: ", message);
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
  for (const [key, value] of Object.entries(COMMANDS)) {
    if (message.startsWith(value)) {
      currentCommand = value;
      currentMessage = message.slice(value.length);
      break;
    }
  }
  if (!currentCommand) {
    console.log(
      process.cwd(),
      "Skipping no command found for:",
      message.substr(0, 20),
      "...",
    );
    return false;
  } else {
    console.log(
      process.cwd(),
      "Found command:",
      currentCommand,
      "with message",
      currentMessage,
    );
  }
  if (currentCommand === COMMANDS.shout) {
    const username = currentMessage;
    const twitchURL = `https://twitch.tv/${username}`;
    await twitchMessageCreate(
      `📡 Shoutout to @${username}! Check them out and show them some love: ${twitchURL} 💜`,
    );
    return true;
  }
  if (currentCommand === COMMANDS.bpm) {
    await twitchMessageCreate(getBpm());
    return true;
  }
  if (isBroadcaster) {
    console.log(
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

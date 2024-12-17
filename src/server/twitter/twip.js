const { twitchMarkerCreate } = require("../twitch/marker");
const { setBroadcastTitle } = require("../twitch/broadcast");
const { twitchClipCreate } = require("../twitch/clip");
const { twitterTweet } = require("./tweet");
const TIMEOUT_WAIT = 2000;
async function twitchTwipCreate(description) {
  try {
    if (!description) return false;
    await twitchMarkerCreate(description);
    await setBroadcastTitle(description);
    await new Promise((r) => setTimeout(r, TIMEOUT_WAIT));
    const url = await twitchClipCreate(description);
    await new Promise((r) => setTimeout(r, TIMEOUT_WAIT));
    await twitterTweet([description, url].join(" "));
    return true;
  } catch (error) {
    console.log(process.cwd(), "Failed to create twip:", error.message);
    return false;
  }
}
module.exports = { twitchTwipCreate };

/**
 * File: src\server\twitch\clip.js
 * Description: Logic and operations for src\server\twitch\clip.js.
 */

const axios = require("axios");
const { setParam } = require("../store/manager");
const { twitchMarkerCreate } = require("./marker");
const { twitchMessageCreate } = require("./message");
const { setBroadcastTitle } = require("./broadcast");
const { getSecret } = require("../store/manager");

const TIMEOUT_WAIT = 2000;
let clipResponses = [];

async function twitchClipCreate(description) {
  try {
    const accessToken = getSecret("twitch_access_token");
    const broadcasterId = getSecret("twitch_broadcaster_id");

    await twitchMarkerCreate(description || "");
    !!description && (await setBroadcastTitle(description));

    await new Promise((r) => setTimeout(r, TIMEOUT_WAIT));

    const response = await axios.post(
      "https://api.twitch.tv/helix/clips",
      { broadcaster_id: broadcasterId },
      {
        headers: {
          "Client-ID": process.env.TWITCH_CLIENT_ID,
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const url = `https://clips.twitch.tv/${response.data.data[0].id}`;
    clipResponses.push({ url, data: response.data });
    setParam("broadcast_clips", clipResponses);

    console.log2(process.cwd(), "Clip created:", url);

    await twitchMessageCreate("🤖 Clip ready: " + url);

    return url;
  } catch (error) {
    console.err2(process.cwd(), "Failed to create clip:", error.message);
    return false;
  }
}

module.exports = { twitchClipCreate };

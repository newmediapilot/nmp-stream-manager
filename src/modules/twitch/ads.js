/**
 * File: src\modules\twitch\clip.js
 * Description: Logic and operations for src\modules\twitch\clip.js.
 */
const { getSecret } = require("../store/manager");
const axios = require("axios");
const { twitchMessageCreate } = require("./message"); // Importing twitchMessageCreate

/**
 * Sends a request to Twitch API to run an advertisement on the channel.
 * Rounds the ad duration to the nearest 30 seconds.
 * @param {number} length - The requested duration of the ad in seconds.
 * @returns {boolean} - True if the ad was started successfully, otherwise false.
 */
async function twitchAdCreate(length) {
  try {
    // Default
    if (!length) length = 30;

    // Round nearest 30 seconds
    const roundedLength = Math.ceil(Number(length) / 30) * 30;

    console.log2(
      process.cwd(),
      `Starting advertisement for ${roundedLength} seconds`,
    );

    const accessToken = getSecret("twitch_access_token");
    const broadcasterId = getSecret("twitch_broadcaster_id");

    const response = await axios.post(
      `https://api.twitch.tv/helix/channels/commercial`,
      {
        broadcaster_id: broadcasterId,
        length: roundedLength,
      },
      {
        headers: {
          "Client-Id": process.env.TWITCH_CLIENT_ID,
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    await twitchMessageCreate(
      `🤖 Get ready, we're running a ${roundedLength} second ad!`,
    );

    if (response.status === 204) {
      console.log2(
        process.cwd(),
        "Advertisement started successfully for",
        roundedLength,
        "seconds",
      );
      return true;
    } else {
      console.err2(
        process.cwd(),
        "Failed to start advertisement:",
        response.status,
      );
      return false;
    }
  } catch (error) {
    console.log2(JSON.stringify(error, null, 4));
    console.err2(
      process.cwd(),
      "Error starting advertisement:",
      error,
      error.response?.data || error.message,
    );
    return false;
  }
}

module.exports = { twitchAdCreate };

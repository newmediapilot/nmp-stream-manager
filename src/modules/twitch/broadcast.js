const axios = require("axios");
const { getSecret } = require("../store/manager");

/**
 * Updates the stream title using Twitch API.
 * @param {string} title - The title to set for the stream.
 * @returns {boolean} - True if the title was updated successfully, otherwise false.
 */
async function setBroadcastTitle(title) {
  if (!title) {
    console.err2(process.cwd(), "No title provided. Skipping update.");
    return false;
  }

  try {
    const accessToken = getSecret("twitch_access_token");
    const broadcasterId = getSecret("twitch_broadcaster_id");

    console.log2(process.cwd(), "Setting stream title to:", title);

    const response = await axios.patch(
      "https://api.twitch.tv/helix/channels",
      { title },
      {
        params: { broadcaster_id: broadcasterId },
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Client-Id": process.env.TWITCH_CLIENT_ID,
          "Content-Type": "application/json",
        },
      },
    );

    if (response.status === 204) {
      console.log2(process.cwd(), "Stream title updated successfully.");
      return title;
    } else {
      console.err2(
        process.cwd(),
        "Failed to update stream title:",
        response.status,
      );
      return false;
    }
  } catch (error) {
    console.err2(
      process.cwd(),
      "Error updating stream title:",
      error.response?.data || error.message,
    );
    return false;
  }
}

module.exports = { setBroadcastTitle };

const fetch = require("node-fetch");
const { getSecret } = require("../store/manager");
async function setBroadcastTitle(title) {
  if (!title) {
    console.log( "No title provided. Skipping update.");
    return false;
  }
  try {
    const accessToken = getSecret("twitch_access_token");
    const broadcasterId = getSecret("twitch_broadcaster_id");
    console.log( "Setting stream title to:", title);
  const response = await fetch(`https://api.twitch.tv/helix/channels?broadcaster_id=${broadcasterId}`, {
      method: 'PATCH',
      headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Client-Id': process.env.TWITCH_CLIENT_ID,
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title })
  });
    if (response.status === 204) {
      console.log( "Stream title updated successfully.");
      return title;
    } else {
      console.log(
        process.cwd(),
        "Failed to update stream title:",
        response.status,
      );
      return false;
    }
  } catch (error) {
    console.log(
      process.cwd(),
      "Error updating stream title:",
      error.response?.data || error.message,
    );
    return false;
  }
}
module.exports = { setBroadcastTitle };
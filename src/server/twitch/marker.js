const fetch = require("fetch");
const { getSecret } = require("../store/manager");
const { createMessage } = require("../twitch/message");
async function twitchMarkerCreate(description) {
  if (!description) {
    console.log(process.cwd(), "No marker description provided. Skipping...");
    return true;
  }
  try {
    const accessToken = getSecret("twitch_access_token");
    const broadcasterId = getSecret("twitch_broadcaster_id");
    console.log(process.cwd(), "Creating marker:", description);
      const response = await fetch('https://api.twitch.tv/helix/streams/markers', {
          method: 'POST',
          headers: {
              'Client-Id': process.env.TWITCH_CLIENT_ID,
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              user_id: broadcasterId,
              description: description
          })
      });
    console.log(
      process.cwd(),
      "Marker created successfully:",
      `${response.data.data[0]?.description}`,
    );
    return true;
  } catch (error) {
    console.log(
      process.cwd(),
      "Error creating marker:",
      error.status,
      error?.message?.message,
    );
    return false;
  }
}
module.exports = { twitchMarkerCreate };
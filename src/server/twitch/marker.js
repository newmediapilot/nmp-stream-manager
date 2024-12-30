const fetch = require("node-fetch");
const { getSecret } = require("../store/manager");
async function twitchMarkerCreate(description) {
  if (!description) {
    console.log( "No marker description provided. Skipping...");
    return true;
  }
  try {
    const accessToken = getSecret("twitch_access_token");
    const broadcasterId = getSecret("twitch_broadcaster_id");
    console.log( "Creating marker:", description);
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
      "Marker created successfully:",
      `${response.data.data[0]?.description}`,
    );
    return true;
  } catch (error) {
    console.log(
      "Error creating marker:",
      error.status,
      error?.message?.message,
    );
    return false;
  }
}
module.exports = { twitchMarkerCreate };
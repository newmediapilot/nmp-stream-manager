const axios = require("axios");
const { getSecret } = require("../store/manager");

async function twitchMarkerCreate(description) {
  if (!description?.length) {
    console.err2(process.cwd(), "No marker description provided. Skipping...");
    return true;
  }

  try {
    const accessToken = getSecret("twitch_access_token");
    const broadcasterId = getSecret("twitch_broadcaster_id");

    console.log2(process.cwd(), "Creating marker:", description);

    const response = await axios.post(
      `https://api.twitch.tv/helix/streams/markers`,
      {
        user_id: broadcasterId,
        description,
      },
      {
        headers: {
          "Client-Id": process.env.TWITCH_CLIENT_ID,
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    console.log2(
      process.cwd(),
      "Marker created successfully:",
      `${response.data.data[0]?.description}`,
    );

    return true;
  } catch (error) {
    console.err2(
      process.cwd(),
      "Error creating marker:",
      error.response?.data || error.message,
    );
    return false;
  }
}

module.exports = { twitchMarkerCreate };

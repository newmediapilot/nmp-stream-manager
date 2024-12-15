const { getSecret } = require("../store/manager");
const axios = require("axios");
const { twitchMessageCreate } = require("./message");
async function twitchAdCreate(length) {
  try {
    if (!length) length = 30;
    const roundedLength = Math.ceil(Number(length) / 30) * 30;
    console.log(
      process.cwd(),
      `Starting advertisement for ${roundedLength} seconds`,
    );
    const accessToken = getSecret("twitch_access_token");
    const broadcasterId = getSecret("twitch_broadcaster_id");
    await twitchMessageCreate(
      `🤖 Get ready, we're running a ${roundedLength} second ad!`,
    );
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
    return true;
  } catch (error) {
    console.err2(process.cwd(), "Error starting advertisement:", error);
    return false;
  }
}
module.exports = { twitchAdCreate };

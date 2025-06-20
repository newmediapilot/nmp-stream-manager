const fetch = require("node-fetch");
const { getSecret } = require("../store/manager");
async function twitchMessageCreate(message) {
  try {
    const accessToken = getSecret("twitch_access_token");
    const broadcasterId = getSecret("twitch_broadcaster_id");
    console.log( "Sending message:", message);
    await fetch('https://api.twitch.tv/helix/chat/messages', {
          method: 'POST',
          headers: {
              'Client-Id': process.env.TWITCH_CLIENT_ID,
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              broadcaster_id: broadcasterId,
              sender_id: broadcasterId,
              message: message,
              color: "purple"
          })
      });
    console.log( "Message sent successfully:", message);
    return true;
  } catch (error) {
    console.log(
      "Error sending message:",
      error.response?.data || error.message,
    );
    return false;
  }
}
module.exports = { twitchMessageCreate };
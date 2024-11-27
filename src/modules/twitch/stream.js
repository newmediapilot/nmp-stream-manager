const tmi = require("tmi.js");
const { getSecret } = require("../store/manager");
const { parseCommand } = require("./commands");

/**
 * Initializes and starts listening for Twitch chat messages.
 * @returns {Promise<void>}
 */
async function watchMessages() {
  const token = getSecret("twitch_access_token");
  const channel = getSecret("twitch_channel_id");

  const client = new tmi.Client({
    options: { debug: true },
    connection: { reconnect: true, secure: true },
    identity: {
      username: channel,
      password: ["oauth:", token].join(""),
    },
    channels: [channel],
  });

  client
    .connect()
    .then(() => {
      console.log2(
        process.cwd(),
        "Connected to Twitch chat for channel:",
        channel,
      );
    })
    .catch((err) =>
      console.log2(process.cwd(), "Error connecting to Twitch chat:", err),
    );

  client.on(
    "message",
    (channel, tags, message) =>
      checkAndLogCommandReceived(tags) && parseCommand(message),
  );
  client.on("disconnected", (reason) =>
    console.log2(process.cwd(), "Disconnected from Twitch chat:", reason),
  );
}

/**
 * Logs "Command received" if all specified conditions are true for the payload.
 * ie. Verify message authority is broadcaster who is in this app right now
 * @param {Object} tags - The payload to validate.
 */
function checkAndLogCommandReceived(tags) {

  const broadcasterId = getSecret("twitch_broadcaster_id");
  const channelId = getSecret("twitch_channel_id");

  // Verify message authority
  const isBroadcaster = tags.badges.broadcaster === "1";
  const isUserIdMatch = tags["user-id"] === broadcasterId;
  const isRoomIdMatch = tags["room-id"] === broadcasterId;
  const isUsernameMatch = tags.username === channelId;
  const isDisplayNameMatch = tags["display-name"] === channelId;

  return (
    isBroadcaster &&
    isUserIdMatch &&
    isRoomIdMatch &&
    isUsernameMatch &&
    isDisplayNameMatch
  );
}

module.exports = { watchMessages };

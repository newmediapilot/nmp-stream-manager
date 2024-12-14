/**
 * File: src\server\twitch\stream.js
 * Description: Logic and operations for src\server\twitch\stream.js.
 */

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
    .then(() =>
      console.log2(
        process.cwd(),
        "Connected to Twitch chat for channel:",
        channel,
      ),
    )
    .catch((err) =>
      console.log2(process.cwd(), "Error connecting to Twitch chat:", err),
    );

  client.on("message", parseCommand);
  client.on("disconnected", (reason) =>
    console.log2(process.cwd(), "Disconnected from Twitch chat:", reason),
  );
}

module.exports = { watchMessages };

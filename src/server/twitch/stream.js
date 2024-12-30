const tmi = require("tmi.js");
const {getSecret} = require("../store/manager");
const {parseCommand} = require("./commands");
const watchMessages = async () => {
    const token = getSecret("twitch_access_token");
    const channel = getSecret("twitch_channel_id");
    const client = new tmi.Client({
        options: {debug: true},
        connection: {reconnect: true, secure: true},
        identity: {
            username: channel,
            password: ["oauth:", token].join(""),
        },
        channels: [channel],
    });
    client
        .connect()
        .then(() =>
            console.log(
                "Connected to Twitch chat for channel:",
                channel,
            ),
        )
        .catch((err) =>
            console.log("Error connecting to Twitch chat:", err),
        );
    client.on("message", parseCommand);
    client.on("disconnected", (reason) =>
        console.log("Disconnected from Twitch chat:", reason),
    );
};
module.exports = {watchMessages};
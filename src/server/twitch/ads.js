const {getSecret} = require("../store/manager");
const fetch = require("node-fetch");
const {twitchMessageCreate} = require("./message");
async function twitchAdCreate(length) {
    try {
        if (!length || length>180) length = 30;
        const roundedLength = Math.ceil(Number(length) / 30) * 30;
        console.log(
            process.cwd(),
            `Starting advertisement for ${roundedLength} seconds`,
        );
        const accessToken = getSecret("twitch_access_token");
        const broadcasterId = getSecret("twitch_broadcaster_id");
        await fetch('https://api.twitch.tv/helix/channels/commercial', {
            method: 'POST',
            headers: {
                'Client-Id': process.env.TWITCH_CLIENT_ID,
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                broadcaster_id: broadcasterId,
                length: roundedLength
            })
        });
        await twitchMessageCreate(
            `🤖 Get ready, we're running a ${roundedLength} second ad!`,
        );
        return true;
    } catch (error) {
        console.log( "Error starting advertisement:", error);
        return false;
    }
}

module.exports = {twitchAdCreate};

const fetch = require("node-fetch");
const {ROUTES} = require("../routes");
const { getSecret, setSecret, getParam, setParam, resetSecrets} = require("../store/manager");
const {watchMessages} = require("./stream");
const redirectURI = `https://localhost${ROUTES.TWITCH_LOGIN_SUCCESS}`;
function twitchLogin(req, res) {
    const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
    const TWITCH_SCOPES = process.env.TWITCH_SCOPES;
    console.log( "twitchLogin start...");
    const oauthUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${TWITCH_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectURI)}&response_type=code&scope=${TWITCH_SCOPES}`;
    console.log( "OAuth URL generated:", oauthUrl);
    res.redirect(oauthUrl);
}
async function twitchLoginSuccess(req, res) {
    resetSecrets();
    const code = req.query.code;
    const state = req.query.state;
    try {
        const url = `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&code=${code}&grant_type=authorization_code&redirect_uri=${encodeURIComponent(redirectURI)}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        const json = await response.json();
        setParam("twitch_username", state);
        setSecret("twitch_access_token", json.access_token);
        setSecret("twitch_refresh_token", json.refresh_token);
        await getBroadcasterId();
        await getChannelId();
        await watchMessages();
        return res.send("OAuth tokens retrieved successfully");
    } catch (error) {
        console.log(
            "twitchLoginSuccess :: error",
            error.response?.data || error.message,
        );
        return res.send("Failed to get OAuth tokens");
    }
}
async function getBroadcasterId() {
    try {
        const username = getParam("twitch_username");
        const accessToken = getSecret("twitch_access_token");
        console.log(
            "Access Token:",
            String("X").repeat(accessToken.length),
        );
        const response = await fetch(`https://api.twitch.tv/helix/users?login=${username}`, {
            method: 'GET',
            headers: {
                'Client-ID': process.env.TWITCH_CLIENT_ID,
                'Authorization': `Bearer ${accessToken}`
            }
        });
        const json = await response.json();
        console.log('getBroadcasterId :: json', json);
        if (json.data && json.data.length > 0) {
            const broadcasterId = json.data[0].id;
            console.log(
                "Broadcaster ID fetched:",
                String("X").repeat(broadcasterId.length),
            );
            setSecret("twitch_broadcaster_id", broadcasterId);
            return broadcasterId;
        } else {
            setSecret("twitch_broadcaster_id", undefined);
        }
    } catch (error) {
        setSecret("twitch_broadcaster_id", undefined);
        console.log( "Error fetching broadcaster ID:", error);
        return false;
    }
}
async function getChannelId() {
    try {
        const username = getParam("twitch_username");
        const accessToken = getSecret("twitch_access_token");
        const response = await fetch(`https://api.twitch.tv/helix/users?login=${username}`, {
            method: 'GET',
            headers: {
                'Client-ID': process.env.TWITCH_CLIENT_ID,
                'Authorization': `Bearer ${accessToken}`
            }
        });
        const json = await response.json();
        console.log('getChannelId :: json', json);
        if (json.data && json.data.length > 0) {
            const channelId = json.data[0].login;
            console.log( "Channel ID fetched:", channelId);
            setSecret("twitch_channel_id", channelId);
            return channelId;
        } else {
            setSecret("twitch_channel_id", undefined);
        }
    } catch (error) {
        setSecret("twitch_channel_id", undefined);
        console.log( "Error fetching Channel ID:", error);
        return false;
    }
}
module.exports = {twitchLogin, twitchLoginSuccess};

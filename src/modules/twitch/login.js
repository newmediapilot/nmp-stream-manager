/**
 * File: src\modules\twitch\login.js
 * Description: Logic and operations for src\modules\twitch\login.js.
 */

/**
 * File: src\modules\twitch\login.js
 * Description: This file contains logic for managing src\modules\twitch\login operations.
 * Usage: Import relevant methods/functions as required.
 */

const axios = require("axios");
const ROUTES = require("../routes");
const {
    getSecret,
    setSecret,
    getParam,
    setParam,
    resetSecrets,
} = require("../store/manager");
const {watchMessages} = require("./stream");

/**
 * Initiates the login flow
 * @param req
 * @param res
 */
function twitchLogin(req, res) {
    const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
    const TWITCH_SCOPES = process.env.TWITCH_SCOPES;

    console.log2(process.cwd(), "twitchLogin start...");
    console.log2(process.cwd(), "TWITCH_SCOPES:", TWITCH_SCOPES);
    console.log2(process.cwd(), "ROUTES.TWITCH_REDIRECT:", ROUTES.TWITCH_REDIRECT);

    setParam("twitch_login_referrer", ROUTES.PANEL_DASHBOARD);
    const oauthUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${TWITCH_CLIENT_ID}&redirect_uri=${encodeURIComponent(ROUTES.TWITCH_REDIRECT)}&response_type=code&scope=${TWITCH_SCOPES}`;

    console.log2(process.cwd(), "OAuth URL generated:", oauthUrl);

    res.redirect(oauthUrl);
}

/**
 * Redirected here from Twitch on login success
 * We perform a series of post-connection fetches and configs
 * @param req
 * @param res
 * @returns {Promise<*|void|Response>}
 */
async function twitchLoginSuccess(req, res) {
    resetSecrets();

    const code = req.query.code;

    try {
        const response = await axios.post(
            "https://id.twitch.tv/oauth2/token",
            null,
            {
                params: {
                    client_id: process.env.TWITCH_CLIENT_ID,
                    client_secret: process.env.TWITCH_CLIENT_SECRET,
                    code: code,
                    grant_type: "authorization_code",
                    redirect_uri: ROUTES.TWITCH_REDIRECT,
                },
            },
        );

        const accessToken = response.data.access_token;
        const refreshToken = response.data.refresh_token;

        setSecret("twitch_access_token", accessToken);
        setSecret("twitch_refresh_token", refreshToken);

        await getBroadcasterId();
        await getChannelId();
        await watchMessages();

        const referrer = getParam("twitch_login_referrer");

        if (referrer) {
            setParam("twitch_login_referrer", undefined);
            return res.redirect(referrer);
        }

        return res.send("OAuth tokens retrieved successfully");
    } catch (error) {
        console.log2(
            process.cwd(),
            "Error exchanging code for tokens:",
            error.response?.data || error.message,
        );
        return res.send("Failed to get OAuth tokens");
    }
}

/**
 * Gets the broadcaster id for the Twitch API
 * @returns {Promise<boolean|*>}
 */
async function getBroadcasterId() {
    try {
        const username = getParam("twitch_username");

        const accessToken = getSecret("twitch_access_token");
        console.log2(
            process.cwd(),
            "Access Token:",
            String("X").repeat(accessToken.length),
        );
        const response = await axios.get(
            `https://api.twitch.tv/helix/users?login=${username}`,
            {
                headers: {
                    "Client-ID": process.env.TWITCH_CLIENT_ID,
                    Authorization: `Bearer ${accessToken}`, // Use the access token here
                },
            },
        );

        if (response.data.data && response.data.data.length > 0) {
            const broadcasterId = response.data.data[0].id;
            console.log2(
                process.cwd(),
                "Broadcaster ID fetched:",
                String("X").repeat(broadcasterId.length),
            );
            setSecret("twitch_broadcaster_id", broadcasterId);
            return broadcasterId;
        } else {
            setSecret("twitch_broadcaster_id", undefined);
            throw new Error("No broadcaster found");
        }
    } catch (error) {
        setSecret("twitch_broadcaster_id", undefined);
        console.err2(process.cwd(), "Error fetching broadcaster ID:", error);
        return false;
    }
}

/**
 * Fetches the Broadcaster's Channel ID (Twitch username/login)
 * @returns {Promise<string|boolean>} - The broadcaster's channel ID or `false` on failure
 */
async function getChannelId() {
    try {
        const username = getParam("twitch_username");
        const accessToken = getSecret("twitch_access_token");

        const response = await axios.get(
            `https://api.twitch.tv/helix/users?login=${username}`,
            {
                headers: {
                    "Client-ID": process.env.TWITCH_CLIENT_ID,
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );

        if (response.data.data && response.data.data.length > 0) {
            const channelId = response.data.data[0].login;
            console.log2(process.cwd(), "Channel ID fetched:", channelId);
            setSecret("twitch_channel_id", channelId);
            return channelId;
        } else {
            setSecret("twitch_channel_id", undefined);
            throw new Error("No channel found");
        }
    } catch (error) {
        setSecret("twitch_channel_id", undefined);
        console.err2(process.cwd(), "Error fetching Channel ID:", error);
        return false;
    }
}

module.exports = {twitchLogin, twitchLoginSuccess};

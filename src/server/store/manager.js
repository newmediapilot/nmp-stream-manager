const fs = require("fs");
let paramsState = {};
let secrets = {};
const allowedParams = [
    "dashboard_signals_config",
    "device_ip",
    "emoji_collection",
    "public_module_styles",
    "public_routes",
    "twitch_access_token_set",
    "twitch_broadcaster_id_set",
    "twitch_channel_id_set",
    "twitch_login_referrer",
    "twitch_refresh_token_set",
    "twitch_username",
];

function setParam(key, value, log = true) {
    if (!allowedParams.includes(key)) {
        console.log(
            "setParam :: attempted to set unregistered key",
            key,
            "with",
            value,
        );
    }
    paramsState[key] = value;
    log && console.log("setParam :: set", key, "::", value);
}

function getAllParams() {
    return paramsState;
}

function getParam(key) {
    return paramsState[key];
}

function resetSecrets() {
    fs.rmSync("secrets", {force: true});
    console.log("resetSecrets :: removing secrets");
}

function setSecret(name, key) {
    try {
        secrets[name] = key;
        setParam(`${name}_set`, true);
        console.log(
            `setSecret :: secret set for ${name} : ${String("X").repeat(String(key).length)}`,
        );
    } catch (error) {
        console.log("setSecret :: error setting secret:", error.message);
    }
}

function getSecret(name) {
    try {
        if (secrets[name]) {
            return secrets[name];
        } else {
            console.log(`getSecret :: secret ${name} not found.`);
            return null;
        }
    } catch (error) {
        console.log("getSecret :: error getting secret:", error.message);
        return null;
    }
}

module.exports = {setParam, getParam, getAllParams, setSecret, getSecret, resetSecrets};

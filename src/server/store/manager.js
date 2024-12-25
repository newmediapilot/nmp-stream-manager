const fs = require("fs");
let paramsState = {};
let secrets = null;
const allowedParams = [
    "dashboard_signals_config",
    "device_ip",
    "emoji_collection",
    "public_module_styles",
    "public_routes",
    "sensor_bpm_rate",
    "twitch_access_token_set",
    "twitch_broadcaster_id_set",
    "twitch_channel_id_set",
    "twitch_login_referrer",
    "twitch_refresh_token_set",
    "twitch_username",
];

function loadSecrets() {
    if (fs.existsSync(".secrets")) {
        try {
            secrets = JSON.parse(fs.readFileSync(".secrets", "utf8"));
            console.log("loadSecrets :: done");
        } catch (error) {
            console.log("loadSecrets :: error loading secrets:", error.message);
            secrets = {};
        }
    } else {
        secrets = {};
    }
}

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
    const value = paramsState[key];
    if (value === undefined) {
        // console.log(
        //   process.cwd(),
        //   "Warning: Attempted to get",
        //   key,
        //   "failed with",
        //   value,
        // );
    } else {
        // console.info(process.cwd(), "Get", key, "::", value);
    }
    return value;
}

function resetSecrets() {
    fs.rmSync(".secrets", {force: true});
    console.log("resetSecrets :: removing secrets");
}

function setSecret(name, key) {
    try {
        loadSecrets();
        secrets[name] = key;
        setParam(`${name}_set`, true);
        const secretsJSON = JSON.stringify(secrets, null, 2);
        secrets = null;
        fs.writeFileSync(".secrets", secretsJSON, "utf8");
        console.log(
            `setSecret :: secret set for ${name} : ${String("X").repeat(String(key).length)}`,
        );
    } catch (error) {
        console.log("setSecret :: error setting secret:", error.message);
    }
}

function getSecret(name) {
    try {
        loadSecrets();
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

module.exports = {
    setParam,
    getParam,
    getAllParams,
    setSecret,
    getSecret,
    resetSecrets,
};

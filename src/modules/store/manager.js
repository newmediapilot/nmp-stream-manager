/**
 * File: src\modules\store\manager.js
 * Description: Logic and operations for src\modules\store\manager.js.
 */

/**
 * File: src\modules\store\manager.js
 * Description: This file contains logic for managing src\modules\store\manager operations.
 * Usage: Import relevant methods/functions as required.
 */
/**
 * Manages state in a primitive singleton
 * setParam and getParam save globally accessible data to memory (synchronously) but invoked often by async functions (beware)
 * setSecret and getSecret create a .secrets(json) file and save values there for retrieval of temp tokens etc
 * setSecret works by writing directly and reading directly from file at point of access to ensure sync behaviour
 */

const fs = require("fs");

let paramsState = {};
let secrets = null;

// Register setParam to capture any unexpected behaviour
// Light debugging effort
const allowedParams = [
  "dashboard_signals_config",
  "device_ip",
  "sensor_heart_rate",
  "twitch_login_referrer",
  "twitch_broadcaster_id_set",
  "twitch_access_token_set",
  "twitch_refresh_token_set",
  "twitch_channel_id_set",
];

function loadSecrets() {
  if (fs.existsSync(".secrets")) {
    try {
      secrets = JSON.parse(fs.readFileSync(".secrets", "utf8"));
    } catch (error) {
      console.log2(process.cwd(), "Error loading secrets:", error.message);
      secrets = {};
    }
  } else {
    secrets = {};
  }
}

function setParam(key, value, log = true) {
  if (!allowedParams.includes(key)) {
    console.warn2(
      process.cwd(),
      "Attempted to set unregistered key",
      key,
      "with",
      value,
    );
  }
  paramsState[key] = value;
  log && console.log2(process.cwd(), "Set", key, "::", value);
}

function getAllParams() {
  return paramsState;
}

function getParam(key) {
  const value = paramsState[key];
  if (value === undefined) {
    console.warn2(
      process.cwd(),
      "Warning: Attempted to get",
      key,
      "failed with",
      value,
    );
  } else {
    // console.info2(process.cwd(), "Get", key, "::", value);
  }
  return value;
}

function resetSecrets() {
  fs.rmSync("/secrets.js", { force: true });
  console.warn2(process.cwd(), "Removing secrets");
}

function setSecret(name, key) {
  try {
    loadSecrets();

    secrets[name] = key;
    setParam(`${name}_set`, true);

    const secretsJSON = JSON.stringify(secrets, null, 2);

    // Reset secrets so it reloads next time
    secrets = null;

    fs.writeFileSync(".secrets", secretsJSON, "utf8");
    console.log2(
      process.cwd(),
      `Secret set for ${name} : ${String("X").repeat(String(key).length)}`,
    );
  } catch (error) {
    console.err2(process.cwd(), "Error setting secret:", error.message);
  }
}

function getSecret(name) {
  try {
    loadSecrets();

    if (secrets[name]) {
      return secrets[name];
    } else {
      console.log2(process.cwd(), `Secret ${name} not found.`);
      return null;
    }
  } catch (error) {
    console.err2(process.cwd(), "Error getting secret:", error.message);
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

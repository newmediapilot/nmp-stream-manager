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


const chalk = require('chalk');
const fs = require('fs');

let paramsState = {};
let secrets = null;

// In order to keep runaway params from being set, we must register any usage of setParam
// This ensures that a param isn't set and forgotten, we must only store what we need!
const allowedParams = [
    // Public
    'public_url',
    'twitch_commands',
    'twitch_username',
    'public_routes',
    // Temporary
    'twitch_login_referrer',
    // Secret
    'twitch_access_token_set',
    'twitch_refresh_token_set',
    'twitch_broadcaster_id_set',
    'twitch_channel_id_set',
    'twitch_bot_headers_set',
];

// Helper function to load secrets from the .secrets file
function loadSecrets() {
    if (fs.existsSync('.secrets')) {
        try {
            secrets = JSON.parse(fs.readFileSync('.secrets', 'utf8'));
        } catch (error) {
            console.log2(process.cwd(),'Error loading secrets:', error.message);
            secrets = {};
        }
    } else {
        secrets = {};
    }
}

function setParam(key, value) {
    if (!allowedParams.includes(key)) {
        console.log2(process.cwd(),`WARNING: Attempted to set a parameter (${key}) that is not registered in allowedParams.`);
    }
    paramsState[key] = value;
    console.log2(process.cwd(),`Set ${key} =`);
    console.log2(process.cwd(),`${JSON.stringify(value, null, 4)}`);
}

function getAllParams() {
    return paramsState;
}

function getParam(key) {
    const value = paramsState[key];
    if (value === undefined) {
        console.warn(chalk.bgYellow.black(`Warning: Attempted to get ${key}, but it is undefined.`));
    } else {
        console.log2(process.cwd(),`Get ${key} = ${value}`);
    }
    return value;
}

function resetSecrets() {
    fs.rmSync("/secrets.js", {
        force: true,
    });
    console.log2(process.cwd(),'Removing secrets...');
}

function setSecret(name, key) {
    try {
        loadSecrets();

        secrets[name] = key;
        setParam(`${name}_set`, true);

        const secretsJSON = JSON.stringify(secrets, null, 2);

        // Reset secrets so it reloads next time
        secrets = null;

        fs.writeFileSync('.secrets', secretsJSON, 'utf8');
        console.log2(process.cwd(),`Secret set for ${name} : ${String('X').repeat(String(key).length)}`);
    } catch (error) {
        console.log2(process.cwd(),'Error setting secret:', error.message);
    }
}

function getSecret(name) {
    try {
        loadSecrets();

        if (secrets[name]) {
            return secrets[name];
        } else {
            console.log2(process.cwd(),`Secret ${name} not found.`);
            return null;
        }
    } catch (error) {
        console.log2(process.cwd(),'Error getting secret:', error.message);
        return null;
    }
}

module.exports = { setParam, getParam, getAllParams, setSecret, getSecret, resetSecrets };
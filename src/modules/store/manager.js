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

require('dotenv').config(); // Load environment variables from .env
const chalk = require('chalk'); // Require chalk for colorizing output
const fs = require('fs'); // Import fs module to interact with files

let params = {}; // This object will hold all the query parameters
let secrets = null; // Cached secrets object

// Helper function to load secrets from the .secrets file
function loadSecrets() {
    if (fs.existsSync('.secrets')) {
        try {
            secrets = JSON.parse(fs.readFileSync('.secrets', 'utf8'));
            console.log(chalk.bgGreen.black('Secrets loaded successfully.'));
        } catch (error) {
            console.error(chalk.bgRed.whiteBright('Error loading secrets:', error.message));
            secrets = {}; // Fallback to an empty object
        }
    } else {
        secrets = {}; // No secrets file found, initialize as empty
    }
}

function setParam(key, value) {
    params[key] = value; // Set the parameter in the global object
    console.log(chalk.bgBlue.whiteBright(`Set ${key} = ${value}`));
}

function getAllParams() {
    return params;
}

function getParam(key) {
    const value = params[key]; // Retrieve the value
    if (value === undefined) {
        console.warn(chalk.bgYellow.black(`Warning: Attempted to get ${key}, but it is undefined.`));
    } else {
        console.log(chalk.bgBlue.whiteBright(`Get ${key} = ${value}`));
    }
    return value; // Return the value (undefined if not found)
}

function setSecret(name, key) {
    try {
        if (!secrets) {
            loadSecrets();
        }

        secrets[name] = key; // Update the secrets object
        setParam(name, true); // Store publicly as 'true' once set

        fs.writeFileSync('.secrets', JSON.stringify(secrets, null, 2), 'utf8');
        console.log(chalk.bgGreen.whiteBright(`Secret set for ${name}: ${key}`));

        // Reset secrets so it reloads next time
        secrets = null;
    } catch (error) {
        console.error(chalk.bgRed.whiteBright('Error setting secret:', error.message));
    }
}

function hasSecret(name) {
    if (!secrets) {
        loadSecrets();
    }
    console.error(chalk.bgRed.whiteBright('hasSecret:', !!secrets[name]));
    return !!secrets[name];
}

function getSecret(name) {
    try {
        if (!secrets) {
            loadSecrets();
        }

        if (secrets[name]) {
            return secrets[name];
        } else {
            console.log(chalk.bgYellow.whiteBright(`Secret ${name} not found.`));
            return null;
        }
    } catch (error) {
        console.error(chalk.bgRed.whiteBright('Error getting secret:', error.message));
        return null;
    }
}

module.exports = { setParam, getParam, getAllParams, hasSecret, setSecret, getSecret };

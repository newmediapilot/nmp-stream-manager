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

function setParam(key, value) {
    params[key] = value; // Set the parameter in the global object
    console.log(chalk.bgBlue.whiteBright(`Set ${key} = ${value}`));
}

function getParam(key) {
    console.log(chalk.bgBlue.whiteBright(`Get ${key} = ${params[key]}`));
    return params[key]; // Return the value for the provided key
}

function setSecret(name, key) {
    try {
        let secrets = {};
        if (fs.existsSync('.secrets')) {
            secrets = JSON.parse(fs.readFileSync('.secrets', 'utf8'));
        }

        secrets[name] = key;

        fs.writeFileSync('.secrets', JSON.stringify(secrets, null, 2), 'utf8');
        console.log(chalk.bgGreen.whiteBright(`Secret set for ${name}: ${key}`));
    } catch (error) {
        console.error(chalk.bgRed.whiteBright('Error setting secret:', error.message));
    }
}

function getSecret(name) {
    try {
        if (fs.existsSync('.secrets')) {
            const secrets = JSON.parse(fs.readFileSync('.secrets', 'utf8'));

            if (secrets[name]) {
                return secrets[name];
            } else {
                console.log(chalk.bgYellow.whiteBright(`Secret ${name} not found.`));
                return null;
            }
        } else {
            console.log(chalk.bgYellow.whiteBright('No secrets file found.'));
            return null;
        }
    } catch (error) {
        console.error(chalk.bgRed.whiteBright('Error getting secret:', error.message));
        return null;
    }
}

async function manager(req, res) {
    try {
        const queryParams = req.query; // Capture all query parameters from the URL

        for (const [key, value] of Object.entries(queryParams)) {
            setParam(key, value); // Automatically set each parameter
        }

        res.send({ message: 'Query parameters captured successfully', params: queryParams });
    } catch (error) {
        console.error('Error handling OAuth redirect:', error);
        res.status(500).send('Failed to capture parameters');
    }
}

module.exports = { setParam, getParam, setSecret, getSecret, callbackHelper: manager };
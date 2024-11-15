require('dotenv').config(); // Load environment variables from .env
const chalk = require('chalk'); // Require chalk for colorizing output
const fs = require('fs'); // Import fs module to interact with files

// Singleton to store query parameters
let params = {}; // This object will hold all the query parameters

// Function to set a parameter in the singleton object
function setParam(key, value) {
    params[key] = value; // Set the parameter in the global object
    // Colorizing the "set" action with blue bg and bright white text
    console.log(chalk.bgBlue.whiteBright(`Set ${key} = ${value}`));
}

// Function to get a parameter from the singleton object
function getParam(key) {
    // Colorizing the "get" action with blue bg and bright white text
    console.log(chalk.bgBlue.whiteBright(`Get ${key} = ${params[key]}`));
    return params[key]; // Return the value for the provided key
}

// Function to set a secret in the .secrets file
function setSecret(name, key) {
    try {
        // Check if the .secrets file exists, if not create it
        let secrets = {};
        if (fs.existsSync('.secrets')) {
            // Read the existing secrets from the .secrets file
            secrets = JSON.parse(fs.readFileSync('.secrets', 'utf8'));
        }

        // Add or update the secret
        secrets[name] = key;

        // Write the updated secrets object back to the file
        fs.writeFileSync('.secrets', JSON.stringify(secrets, null, 2), 'utf8');
        console.log(chalk.bgGreen.whiteBright(`Secret set for ${name}: ${key}`));
    } catch (error) {
        console.error(chalk.bgRed.whiteBright('Error setting secret:', error.message));
    }
}

// Function to get a secret from the .secrets file
function getSecret(name) {
    try {
        if (fs.existsSync('.secrets')) {
            // Read the secrets from the .secrets file
            const secrets = JSON.parse(fs.readFileSync('.secrets', 'utf8'));

            // Return the secret value if it exists
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

// Function to handle the OAuth redirect and capture query parameters
async function manager(req, res) {
    try {
        const queryParams = req.query; // Capture all query parameters from the URL

        // Store each query parameter in the singleton object
        for (const [key, value] of Object.entries(queryParams)) {
            setParam(key, value); // Automatically set each parameter
        }

        // Respond with success and the stored parameters
        res.send({ message: 'Query parameters captured successfully', params: queryParams });
    } catch (error) {
        console.error('Error handling OAuth redirect:', error);
        res.status(500).send('Failed to capture parameters');
    }
}

module.exports = { setParam, getParam, setSecret, getSecret, callbackHelper: manager };

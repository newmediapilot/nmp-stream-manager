require('dotenv').config(); // Load environment variables from .env
const chalk = require('chalk'); // Require chalk for colorizing output

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

// Function to handle the OAuth redirect and capture query parameters
async function callbackHelper(req, res) {
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

module.exports = { setParam, getParam, callbackHelper };

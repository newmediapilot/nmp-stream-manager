require('dotenv').config(); // Load environment variables from .env
const ngrok = require('@ngrok/ngrok');

// Starts the ngrok server with static app url of env.NGROK_URL
async function ngrokLaunch(port) {
    try {
        // Connect to Ngrok using a specified static domain
        const tunnel = await ngrok.connect({
            addr: port,
            authtoken: process.env.NGROK_AUTHTOKEN,
            domain: process.env.NGROK_URL, // Specify your static Ngrok domain here
        });

        const publicUrl = await tunnel.url(); // Access the public URL
        return publicUrl;
    } catch (err) {
        console.error('Error starting Ngrok:', err);
        throw err;
    }
}

module.exports = { ngrokLaunch };
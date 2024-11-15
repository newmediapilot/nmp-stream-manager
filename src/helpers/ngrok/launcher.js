require('dotenv').config(); // Load environment variables from .env
const ngrok = require('@ngrok/ngrok');

async function startNgrok(port) {
    try {
        // Connect to Ngrok using a specified static domain
        const tunnel = await ngrok.connect({
            addr: port,
            authtoken: process.env.NGROK_AUTHTOKEN,
            domain: 'longhorn-learning-dodo.ngrok-free.app', // Specify your static Ngrok domain here
        });

        const publicUrl = await tunnel.url(); // Access the public URL
        return publicUrl;
    } catch (err) {
        console.error('Error starting Ngrok:', err);
        throw err;
    }
}

module.exports = { startNgrok };

/**
 * File: src\modules\ngrok\launch.js
 * Description: This file contains logic for managing src\modules\ngrok\launch operations.
 * Usage: Import relevant methods/functions as required.
 */

const ngrok = require('@ngrok/ngrok');

async function ngrokLaunch(port) {
    try {
        const tunnel = await ngrok.connect({
            addr: port,
            authtoken: process.env.NGROK_AUTHTOKEN,
            domain: process.env.NGROK_URL, // Specify your static Ngrok domain here
        });

        const publicUrl = await tunnel.url(); // Access the public URL
        return publicUrl;
    } catch (err) {
        console.log('Error starting Ngrok:', err);
        throw err;
    }
}

module.exports = { ngrokLaunch };
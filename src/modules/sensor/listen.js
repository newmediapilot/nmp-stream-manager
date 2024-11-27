/**
 * File: src\modules\sensor\data.js
 * Description: Logic and operations for src\modules\sensor\data.js.
 */
const {spawn} = require('child_process');

/**
 * File: src\modules\sensor\data.js
 * Description: This file contains logic for managing src\modules\sensor\data operations.
 * Usage: Import relevant methods/functions as required.
 */
async function listenHeartRate() {

}

async function createHeartRateServer(exePath = './bin/hds_desktop_windows.exe') {
    // Start the external process
    const child = spawn(exePath, [], {
        detached: false, // Ensures the process is tied to the parent process
        stdio: 'inherit', // Inherit output to the terminal
    });

    console.log(`Started process with PID: ${child.pid}`);

    // Handle errors during the process execution
    child.on('error', (err) => {
        console.error(`Failed to start process: ${err.message}`);
    });

    // Log when the process exits
    child.on('close', (code) => {
        console.log(`Process exited with code ${code}`);
    });

    // Clean up the child process when Node.js exits
    const shutdown = () => {
        console.log('Node.js is shutting down. Killing the process...');
        if (!child.killed) {
            child.kill('SIGTERM'); // Send SIGTERM to allow graceful shutdown
        }
        process.exit();
    };

    process.on('exit', shutdown); // On process exit
    process.on('SIGINT', shutdown); // On Ctrl+C
    process.on('SIGTERM', shutdown); // On termination signals
    process.on('uncaughtException', (err) => {
        console.error('Uncaught exception:', err);
        shutdown();
    });
}

module.exports = {listenHeartRate, createHeartRateServer};

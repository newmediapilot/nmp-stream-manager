const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'crash.log');

// Function to write logs to the file
const logError = (error) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${error.stack || error}\n`;
    fs.appendFileSync(logFile, logMessage);
};

// Capture uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    logError(err);
    process.exit(1); // Exit the application
});

// Capture unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
    logError(reason);
    process.exit(1); // Exit the application
});

console.log('Application started...');

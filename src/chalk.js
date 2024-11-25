// chalk.js
const chalk = require('chalk');

// Create a custom chalk instance
const customChalk = new chalk.Instance({ level: 3 }); // Enables full color support (ANSI 16m)

// Define custom styles
const styles = {
    success: customChalk.hex('#4caf50'), // Green for success messages
    error: customChalk.hex('#f44336'),   // Red for error messages
    info: customChalk.hex('#2196f3'),    // Blue for informational messages
    warning: customChalk.hex('#ff9800'), // Orange for warnings
    highlight: customChalk.bgHex('#ffeb3b').hex('#000000'), // Yellow background, black text
};

// Export the styles for use in your application
module.exports = styles;

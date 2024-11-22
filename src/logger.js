//
const chalk = require('chalk');

/**
 * Middleware to log request details with colorful output
 * @param {Object} app - The Express application instance
 */
requestLogger = (req, res, next) => {

    console.log(
        chalk.green('REQUEST =>'),
        chalk.cyan(req.path),
    );

    next();
};

module.exports = {requestLogger};

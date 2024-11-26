//
const chalk = require('chalk');

/**
 * Middleware to log request details with colorful output
 * @param {Object} app - The Express application instance
 */
requestLogger = (req, res, next) => {

    console.log('REQUEST =>', req.path);
    next();

};

module.exports = {requestLogger};

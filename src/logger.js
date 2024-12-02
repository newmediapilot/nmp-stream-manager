/**
 * File: src\logger.js
 * Description: Logic and operations for src\logger.js.
 */

/**
 * Middleware to log request details with colorful output
 * @param {Object} app - The Express application instance
 */
const ROUTES = require('./routes');
const ignoredPaths = [
    ROUTES.PUBLIC_HEART_PING
];
requestLogger = (req, res, next) => {
    // Some paths which constantly log can be ignored
    if (ignoredPaths.includes(req.path)) {
        next();
        return;
    }
    console.info2(
        process.cwd(),
        "REQUEST =>",
        req.path,
        "PARAMS =>",
        JSON.stringify(req.query || {}, null, 4),
    );
    next();
};

module.exports = {requestLogger};

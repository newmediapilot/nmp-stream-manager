/**
 * File: src\logger.js
 * Description: Logic and operations for src\logger.js.
 */

/**
 * Middleware to log request details with colorful output
 * @param {Object} app - The Express application instance
 */
requestLogger = (req, res, next) => {
  console.info2(
    process.cwd(),
    "REQUEST =>",
    req.path,
    "PARAMS =>",
    JSON.stringify(req.query || {}, null, 4),
  );
  next();
};

module.exports = { requestLogger };

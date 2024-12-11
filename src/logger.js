/**
 * File: src\logger.js
 * Description: Logic and operations for src\logger.js.
 */

/**
 * Middleware to log request details with colorful output
 * @param {Object} app - The Express application instance
 */
const ROUTES = require("./routes");
requestLogger = (req, res, next) => {
  // Ignore
  if ([
      ROUTES.PUBLIC_BPM_PING
  ].includes(req.path)) {
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

module.exports = { requestLogger };

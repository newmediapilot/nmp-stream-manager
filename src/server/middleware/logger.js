const ROUTES = require("../routes");
const logger = (req, res, next) => {
    // Ignore
    if ([
        ROUTES.API_BPM_PING
    ].includes(req.path)) {
        next();
        return;
    }
    console.info(
        process.cwd(),
        "REQUEST =>",
        req.path,
        "PARAMS =>",
        JSON.stringify(req.query || {}, null, 4),
    );
    next();
};
module.exports = {logger};

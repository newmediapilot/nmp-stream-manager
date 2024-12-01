const { getParam } = require("../store/manager");

/**
 * API Endpoint to return the current heart rate.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
function publicHeartPing(req, res) {
    const heartRate = getParam("sensor_heart_rate");
    if (heartRate !== undefined && heartRate !== null) {
        res.send(String(heartRate));
    } else {
        res.send("null");
    }
}

module.exports = { publicHeartPing };

const { getParam } = require("../store/manager");

/**
 * API Endpoint to return the current bpm rate.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
function publicBpmPing(req, res) {
  const bpmRate = getParam("sensor_bpm_rate");
  if (bpmRate !== undefined && bpmRate !== null) {
    res.send(String(bpmRate));
  } else {
    res.send("null");
  }
}

module.exports = { publicBpmPing };

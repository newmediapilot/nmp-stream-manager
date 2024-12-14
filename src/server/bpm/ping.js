const { getParam } = require("../store/manager");
function publicBpmPing(req, res) {
  const bpmRate = getParam("sensor_bpm_rate");
  if (bpmRate !== undefined && bpmRate !== null) {
    res.send(String(bpmRate));
  } else {
    res.send("null");
  }
}
module.exports = { publicBpmPing };

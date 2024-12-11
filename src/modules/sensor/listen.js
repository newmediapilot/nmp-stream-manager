/**
 * File: src\modules\sensor\data.js
 * Description: Logic and operations for src\modules\sensor\data.js.
 */
const { setParam, getParam } = require("../store/manager");
const { spawn } = require("child_process");

async function createbpmRateServer(
  exePath = ".bin/hds_desktop_windows.exe",
) {
  let MAX_REPORT = 5; // Don't keep logging
  const child = spawn(exePath, [], { detached: false });

  // Capture log and save sensor_bpm_rate
  child.stdout.on("data", (data) => {
    const log = data.toString();
    const pref = "Received data: bpmRate:";
    const bpmRate = parseInt(log.match(/\d+/)?.[0], 10);

    log.startsWith(pref) &&
      !isNaN(bpmRate) &&
      setParam("sensor_bpm_rate", bpmRate, --MAX_REPORT > 0);
  });

  // Clean up
  const shutdown = () => {
    child.kill("SIGTERM");
    process.exit();
  };

  // Shutdown listeners
  process.on("exit", shutdown); // exit
  process.on("SIGINT", shutdown); // Ctrl+C
  process.on("SIGTERM", shutdown); // signals
  process.on(
    "uncaughtException",
    (err) => console.error("Uncaught exception:", err) && shutdown(),
  );

  // Errors
  child.on("error", (err) =>
    console.error(`Failed to start process: ${err.message}`),
  );
  child.on("close", (code) => console.log2(`Process exited with code ${code}`));
}

/**
 * Generates bpm rate message based on sensor_bpm_rate
 * @returns {string}
 */
const getbpmRateMessage = () => {
  const bpmRate = getParam("sensor_bpm_rate");
  return bpmRate ? `🤖 💜 ${bpmRate}` : `🤖 💜 Dunno.`;
};

module.exports = { createbpmRateServer, getbpmRateMessage };

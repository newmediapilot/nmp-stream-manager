const { setParam, getParam } = require("../store/manager");
const { spawn } = require("child_process");
async function createbpmRateServer(
  exePath = ".bin/hds_desktop_windows.exe",
) {
  let MAX_REPORT = 5;
  const child = spawn(exePath, [], { detached: false });
  child.stdout.on("data", (data) => {
    const log = data.toString();
    const pref = "Received data: bpmRate:";
    const bpmRate = parseInt(log.match(/\d+/)?.[0], 10);

    log.startsWith(pref) &&
      !isNaN(bpmRate) &&
      setParam("sensor_bpm_rate", bpmRate, --MAX_REPORT > 0);
  });
  const shutdown = () => {
    child.kill("SIGTERM");
    process.exit();
  };
  process.on("exit", shutdown); // exit
  process.on("SIGINT", shutdown); // Ctrl+C
  process.on("SIGTERM", shutdown); // signals
  process.on(
    "uncaughtException",
    (err) => console.log("Uncaught exception:", err) && shutdown(),
  );
  child.on("error", (err) =>
    console.log(`Failed to start process: ${err.message}`),
  );
  child.on("close", (code) => console.log(`Process exited with code ${code}`));
}
const getbpmRateMessage = () => {
  const bpmRate = getParam("sensor_bpm_rate");
  return bpmRate ? `🤖 💜 ${bpmRate}` : `🤖 💜 Dunno.`;
};
module.exports = { createbpmRateServer, getbpmRateMessage };
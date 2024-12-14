const os = require("os");

/**
 * Retrieves the local IP address of the current machine.
 * @returns {string|void}
 */
function getIp() {
  const interfaces = os.networkInterfaces();
  for (const name in interfaces) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
}

module.exports = { getIp };

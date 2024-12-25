const os = require("os");
const {setParam} = require("../store/manager");
const getIp = () => {
    const interfaces = os.networkInterfaces();
    for (const name in interfaces) {
        for (const iface of interfaces[name]) {
            if (iface.family === "IPv4" && !iface.internal) {
                return iface.address;
            }
        }
    }
};
const configureIp = () => {
    setParam("device_ip", getIp());
    setParam("device_ip_suffix", getIp().split('.').pop());
};
module.exports = {getIp, configureIp};
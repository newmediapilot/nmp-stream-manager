const DASHBOARD_BUTTON_CONFIG = {
    signals: [
        {
            label: "aaknot",
            theme: "aqua",
            type: "feature",
            description: "feature:set",
            emoji: "👉",
        },
        {
            emoji: "👉",
            theme: "orange",
            type: "ad",
            description: "30",
            label: "30s",
        },
        {
            emoji: "❤",
            theme: "bloodorange",
            type: "bpm",
            description: "bpm",
            label: "BPM",
        },
        {
            emoji: "👉",
            label: "Ping",
            theme: "purple",
            type: "mark",
            description: "match:checkpoint",
        }
    ],
};
const fs = require("fs");
const path = require("path");
const {setParam, getParam} = require("../store/manager");
const initializePublicConfigs = async (type) => {
    console.log2(process.cwd(), "initializePublicConfigs :: start");
    const fileName = path.resolve(`.${type}.json`);
    try {
        if (!fs.existsSync(fileName)) {
            setParam("dashboard_signals_config", DASHBOARD_BUTTON_CONFIG.signals);
            putConfig("signals", DASHBOARD_BUTTON_CONFIG.signals);
            console.log2(process.cwd(), "initializePublicConfigs :: new file");
        } else {
            setParam("dashboard_signals_config", getConfig("signals"));
            console.log2(process.cwd(), "initializePublicConfigs :: load file");
        }
        console.log2(process.cwd(), "initializePublicConfigs :: success");
        return true;
    } catch (e) {
        console.err2(process.cwd(), "initializePublicConfigs :: error", e);
        return false;
    } finally {
        console.log2(process.cwd(), "initializePublicConfigs :: done");
    }
};
const putConfig = (filePath, config) => {
    const fileName = path.resolve(`.${filePath}.json`);
    console.log2(process.cwd(),
        "putConfig :: file:",
        fileName.substr(-10),
        ":: contents :",
        config.map((c) => c.label),
    );
    fs.writeFileSync(fileName, JSON.stringify(config), {encoding: "utf-8"});
};
const getConfig = (type) => {
    const fileName = path.resolve(`.${type}.json`);
    console.log2(process.cwd(), "getConfig :: file:", fileName);
    return JSON.parse(fs.readFileSync(fileName, "utf-8"));
};
const applySignalsOrder = (payloadJSON) => {
    const payloadAction = payloadJSON ? JSON.parse(payloadJSON) : [];
    const signalsTarget = JSON.parse(
        JSON.stringify(getParam("dashboard_signals_config")),
    );
    while (payloadAction.length > 0) {
        const [from, to] = payloadAction.splice(0, 2);
        const fromEl = signalsTarget.splice(from, 1)[0];
        signalsTarget.splice(to, 0, fromEl);
    }
    setParam("dashboard_signals_config", signalsTarget);
    return signalsTarget;
};
const applySignalsField = (payloadJSON) => {
    console.log2(process.cwd(), "applySignalsField", payloadJSON);
    const signalsTarget = JSON.parse(
        JSON.stringify(getParam("dashboard_signals_config")),
    );
    const {id, field, value} = JSON.parse(payloadJSON);
    signalsTarget[Number(id)][field] = value;
    setParam("dashboard_signals_config", signalsTarget);
    return signalsTarget;
};
const publicConfigUpdate = (req, res) => {
    const {type, payload} = req.query;
    console.log2(process.cwd(), "publicConfigUpdate", type, payload);
    try {
        if (type === "signals:order") {
            putConfig("signals", applySignalsOrder(payload));
        }
        if (type === "signals:field") {
            putConfig("signals", applySignalsField(payload));
        }
        res.status(200).json({
            message: "Configuration for " + type + " updated successfully.",
        });
    } catch (error) {
        console.err2(
            process.cwd(),
            "Error processing configuration:",
            error.message,
        );
        res.status(500).json({error: error.message});
    }
};
module.exports = {
    DASHBOARD_BUTTON_CONFIG,
    initializePublicConfigs,
    publicConfigUpdate,
};
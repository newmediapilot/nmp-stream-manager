const DASHBOARD_BUTTON_CONFIG = {
    signals: [
        {
            emoji: "👉",
            label: "aaknot",
            theme: "aqua",
            type: "feature",
            description: "feature:set",
            visibility: "ON",
        },
        {
            emoji: "👉",
            theme: "orange",
            type: "ad",
            description: "30",
            label: "30s",
            visibility: "ON",
        },
        {
            emoji: "❤",
            theme: "bloodorange",
            type: "bpm",
            description: "bpm",
            label: "BPM",
            visibility: "ON",
        },
        {
            emoji: "👉",
            theme: "purple",
            type: "mark",
            description: "match:checkpoint",
            label: "Ping",
            visibility: "ON",
        },
        {
            emoji: "👉",
            label: "Announce",
            theme: "green",
            type: "announce",
            description: "A button made this announcement :)",
            visibility: "ON",
        },
        {
            emoji: "👉",
            label: "Sound",
            theme: "red",
            type: "sound",
            description: "a,audio,mp3,wav,webm",
            visibility: "ON",
        },
        {
            emoji: "👉",
            label: "Media",
            theme: "blue",
            type: "media",
            description: "a,image,jpeg,gif,png,webp,bmp",
            visibility: "ON",
        },
    ],
};
const fs = require("fs");
const path = require("path");
const {setParam, getParam} = require("../store/manager");
const initializePublicConfigs = async (type) => {
    console.log(process.cwd(), "initializePublicConfigs :: start");
    const fileName = path.resolve(`.${type}.json`);
    try {
        if (!fs.existsSync(fileName)) {
            setParam("dashboard_signals_config", DASHBOARD_BUTTON_CONFIG.signals);
            putConfig("signals", DASHBOARD_BUTTON_CONFIG.signals);
            console.log(process.cwd(), "initializePublicConfigs :: new file");
        } else {
            setParam("dashboard_signals_config", getConfig("signals"));
            console.log(process.cwd(), "initializePublicConfigs :: load file");
        }
        console.log(process.cwd(), "initializePublicConfigs :: success");
        return true;
    } catch (e) {
        console.log(process.cwd(), "initializePublicConfigs :: error", e);
        return false;
    } finally {
        console.log(process.cwd(), "initializePublicConfigs :: done");
    }
};
const putConfig = (filePath, config) => {
    const fileName = path.resolve(`.${filePath}.json`);
    console.log(process.cwd(),
        "putConfig :: file:",
        fileName,
        ":: contents :",
        config.map((c) => c.label),
    );
    fs.writeFileSync(fileName, JSON.stringify(config), {encoding: "utf-8"});
};
const getConfig = (type) => {
    const fileName = path.resolve(`.${type}.json`);
    console.log(process.cwd(), "getConfig :: file:", fileName);
    return JSON.parse(fs.readFileSync(fileName, "utf-8"));
};
const applySignalsOrder = (payloadJSON) => {
    const payloadAction = payloadJSON ? JSON.parse(payloadJSON) : [];
    const signalsTarget = JSON.parse(
        JSON.stringify(getParam("dashboard_signals_config")),
    );
    //TODO: replace with foreach
    while (payloadAction.length > 0) {
        const [from, to] = payloadAction.splice(0, 2);
        const fromEl = signalsTarget.splice(from, 1)[0];
        signalsTarget.splice(to, 0, fromEl);
    }
    setParam("dashboard_signals_config", signalsTarget);
    return signalsTarget;
};
const applySignalsField = (payloadJSON) => {
    console.log(process.cwd(), "applySignalsField", payloadJSON);
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
    console.log(process.cwd(), "publicConfigUpdate", type, payload);
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
        console.log(
            process.cwd(),
            "Error processing configuration:",
            error.message,
        );
        res.status(500).json({error: error.message});
    }
};
const configFieldUpdate = (id, field, value) => {
    console.log(process.cwd(), "configFieldUpdate", id, field, value);
    const signalsTarget = JSON.parse(JSON.stringify(getParam("dashboard_signals_config")));
    signalsTarget[Number(id)][field] = value;
    setParam("dashboard_signals_config", signalsTarget);
    putConfig("signals", signalsTarget);
};
module.exports = {
    DASHBOARD_BUTTON_CONFIG,
    initializePublicConfigs,
    publicConfigUpdate,
    configFieldUpdate,
};
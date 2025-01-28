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
        {type: "empty"},
        {type: "empty"},
        {type: "empty"},
        {type: "empty"},
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
        {type: "empty"},
        {type: "empty"},
        {type: "empty"},
        {type: "empty"},
        {
            emoji: "👉",
            label: "MediaA",
            theme: "blue",
            type: "media",
            description: "a,image,jpeg,gif,png,webp,bmp",
            visibility: "ON",
        },
        {
            emoji: "👉",
            label: "MediaB",
            theme: "blue",
            type: "media",
            description: "b,image,jpeg,gif,png,webp,bmp",
            visibility: "ON",
        },
        {type: "empty"},
        {type: "empty"},
        {type: "empty"},
        {type: "empty"},
        {
            emoji: "👉",
            label: "SoundA",
            theme: "red",
            type: "sound",
            description: "a,audio,mp3,wav,webm",
            visibility: "ON",
        },
        {
            emoji: "👉",
            label: "SoundB",
            theme: "red",
            type: "sound",
            description: "a,audio,mp3,wav,webm",
            visibility: "ON",
        },
        {type: "empty"},
        {type: "empty"},
        {type: "empty"},
        {type: "empty"},
        {type: "empty"},
        {type: "empty"},
        {type: "empty"},
        {type: "empty"},
        {type: "empty"},
        {type: "empty"},
        {type: "empty"},
        {type: "empty"},
        {type: "empty"},
        {type: "empty"},
        {type: "empty"},
        {type: "empty"},
    ],
};
const fs = require("fs");
const {sendConfig} = require("../public/memory");
const {setParam, getParam} = require("../store/manager");
const initializePublicConfigs = async (type) => {
    console.log("initializePublicConfigs :: start");
    try {
        if (!fs.existsSync(`${type}`)) {
            setParam("dashboard_signals_config", DASHBOARD_BUTTON_CONFIG.signals);
            putConfig(`${type}`, DASHBOARD_BUTTON_CONFIG.signals);
            console.log("initializePublicConfigs :: new file");
        } else {
            setParam("dashboard_signals_config", getConfig("signals"));
            console.log("initializePublicConfigs :: load file");
        }
        sendConfig();
        console.log("initializePublicConfigs :: success");
        return true;
    } catch (e) {
        console.log("initializePublicConfigs :: error", e);
        return false;
    } finally {
        console.log("initializePublicConfigs :: done");
    }
};
const putConfig = (filePath, config) => {
    console.log("putConfig :: file:", filePath);
    fs.writeFileSync(filePath, JSON.stringify(config), {encoding: "utf-8"});
};
const getConfig = (filePath) => {
    console.log("getConfig :: file:", filePath);
    return JSON.parse(String(fs.readFileSync(filePath, {encoding: "utf-8"})));
};
const applySignalsOrder = (payloadJSON) => {
    const payloadAction = payloadJSON ? JSON.parse(payloadJSON) : [];
    const signalsTarget = JSON.parse(JSON.stringify(getParam("dashboard_signals_config")));
    Array.from({length: payloadAction.length / 2}).map(() => {
        const [from, to] = payloadAction.splice(0, 2);
        const [fromEl, toEl] = [signalsTarget[from], signalsTarget[to]];
        signalsTarget[from] = toEl;
        signalsTarget[to] = fromEl;
    });
    setParam("dashboard_signals_config", signalsTarget);
    return signalsTarget;
};
const applySignalsField = (payloadJSON) => {
    console.log("applySignalsField", payloadJSON);
    const signalsTarget = JSON.parse(JSON.stringify(getParam("dashboard_signals_config")));
    const {id, field, value} = JSON.parse(payloadJSON);
    signalsTarget[Number(id)][field] = value;
    setParam("dashboard_signals_config", signalsTarget);
    return signalsTarget;
};
const publicConfigUpdate = (req, res) => {
    const {type, payload} = req.query;
    console.log("publicConfigUpdate", type, payload);
    try {
        if (type === "signals:order") putConfig("signals", applySignalsOrder(payload));
        if (type === "signals:field") putConfig("signals", applySignalsField(payload));
        sendConfig();
        res.status(200).json({message: "Configuration for " + type + " updated successfully."});
    } catch (error) {
        console.log("publicConfigUpdate :: error processing configuration:", error.message);
        res.status(500).json({error: error.message});
    }
};
const configFieldUpdate = (id, field, value) => {
    console.log("publicConfigUpdate ::", id, field, value);
    const signalsTarget = JSON.parse(JSON.stringify(getParam("dashboard_signals_config")));
    signalsTarget[Number(id)][field] = value;
    setParam("dashboard_signals_config", signalsTarget);
    putConfig("signals", signalsTarget);
    sendConfig();
};
module.exports = {initializePublicConfigs, publicConfigUpdate, configFieldUpdate};
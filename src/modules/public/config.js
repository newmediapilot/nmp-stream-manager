const fs = require('fs');
const path = require('path');

// Define public configurations
const PUBLIC_CONFIGS = {
    signals: [
        {
            theme: "orange",
            type: "ad",
            description: "30",
            wait: "30000",
            emoji: "📢",
            label: "Start Ad (30s)",
        },
        {
            theme: "orange",
            type: "ad",
            description: "60",
            wait: "60000",
            emoji: "📢",
            label: "Start Ad (60s)",
        },
        {
            theme: "orange",
            type: "ad",
            description: "120",
            wait: "120000",
            emoji: "📢",
            label: "Start Ad (2min)",
        },
        {
            theme: "orange",
            type: "ad",
            description: "180",
            wait: "180000",
            emoji: "📢",
            label: "Start Ad (3min)",
        },
        {
            theme: "aqua",
            type: "heart",
            description: "heart",
            wait: "3000",
            emoji: "❤️",
            label: "Heart Rate",
        },
        {
            theme: "purple",
            type: "mark",
            description: "match:start",
            wait: "3000",
            emoji: "⏰",
            label: "Start",
        },
        {
            theme: "pink",
            type: "mark",
            description: "match:fight",
            wait: "3000",
            emoji: "🥊",
            label: "Fight",
        },
        {
            theme: "deepyellow",
            type: "mark",
            description: "match:checkpoint",
            wait: "3000",
            emoji: "✔️",
            label: "Tick",
        },
        {
            theme: "deepyellow",
            type: "mark",
            description: "match:idle",
            wait: "3000",
            emoji: "🎬",
            label: "Clip",
        },
        {
            theme: "red",
            type: "mark",
            description: "match:complete",
            wait: "3000",
            emoji: "👾",
            label: "Game Over",
        },
    ]
};

// Save configuration to a file (synchronous)
const putConfig = (type, config) => {
    if (!PUBLIC_CONFIGS[type] || !config) {
        throw new Error("Invalid type or config:", type, config);
    }
    const fileName = path.resolve(`.${type}.json`);
    fs.writeFileSync(fileName, JSON.stringify(config, null, 2));
};

// Load configuration from a file (synchronous)
const getConfig = (type) => {
    if (!PUBLIC_CONFIGS[type]) {
        throw new Error("Invalid type:", type);
    }
    const fileName = path.resolve(`.${type}.json`);
    if (!fs.existsSync(fileName)) {
        return PUBLIC_CONFIGS[type];
    } else {
        return JSON.parse(fs.readFileSync(fileName, 'utf-8'));
    }
};

// Parse updates and apply the swaps to the written file
// Pairs of before & after sent sequentially as saved by FE
const applySignalsPayload = (payloadJSON) => {

    const payload = payloadJSON ? JSON.parse(payloadJSON) : [];
    const signals = PUBLIC_CONFIGS.signals.slice();

    while (payload.length) {
        const [from, to] = payload.splice(0, 2);
        const fromEl = JSON.parse(JSON.stringify(signals[from]));
        const toEl = JSON.parse(JSON.stringify(signals[to]));
        signals[from] = toEl;
        signals[to] = fromEl;
    }

    return signals.slice();
};

// Parse incoming configuration update request
// Sort by type into handlers
const publicConfigUpdate = (req, res) => {

    const {type, payload} = req.query;

    if (!PUBLIC_CONFIGS[type]) return res.status(400).json({error: ("Invalid type: " + type + "")});

    try {

        if (type === "signals") {
            putConfig("signals", applySignalsPayload(payload));
        }

        res.status(200).json({message: ("Configuration for '" + type + "' updated successfully.")});
    } catch (error) {
        console.err2(process.cwd(), "Error processing configuration:", error.message);
        res.status(500).json({error: error.message});
    }
};

// Exported methods and configurations
module.exports = {
    putConfig,
    getConfig,
    publicConfigUpdate,
    PUBLIC_CONFIGS,
};
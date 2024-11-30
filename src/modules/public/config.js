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
const putConfig = (key, payload) => {
    if (!PUBLIC_CONFIGS[key] && !payload) {
        throw new Error("Invalid key:", key);
    }

    const fileName = path.resolve(`.${key}.json`);

    try {
        fs.writeFileSync(fileName, JSON.stringify(payload || PUBLIC_CONFIGS[key], null, 2));
        PUBLIC_CONFIGS[key] = payload; // Update in-memory config
        console.log2("Configuration saved successfully for:", key);
    } catch (error) {
        console.err2("Failed to save config for:", key, error);
        throw error;
    }
};

// Load configuration from a file (synchronous)
const getConfig = (key) => {
    const fileName = path.resolve(`.${key}.json`);

    if (!PUBLIC_CONFIGS[key]) {
        throw new Error("Invalid key:", key);
    }

    try {
        if (!fs.existsSync(fileName)) putConfig(key, PUBLIC_CONFIGS[key]);

        const config = JSON.parse(fs.readFileSync(fileName, 'utf-8'));
        PUBLIC_CONFIGS[key] = config;
        console.log2("Configuration loaded successfully for:", key, PUBLIC_CONFIGS[key]);
        return config;
    } catch (error) {
        console.err2("Failed to load config for:", key, error);
        throw error;
    }
};

// Parse updates and apply the swaps to the written file
// Pairs of before & after sent sequentially as saved by FE
const applySignalsPayload = (payloadJSON) => {

    const payload = payloadJSON ? JSON.parse(payloadJSON) : [];
    const signals = PUBLIC_CONFIGS.signals.slice();

    for (let s = 0; s < payload.length; s += 2) {
        const i1 = s;
        const i2 = s + 1;
        signals[i1] = signals[i2];
    }

    putConfig('signals', signals);
};

// Parse incoming configuration update request
// Sort by type into handlers
const parseConfig = (req, res) => {
    const {key, payload} = req.query;

    if (!PUBLIC_CONFIGS[key]) return res.status(400).json({error: ("Invalid key: " + key + "")});

    try {
        if (key === "signals") {
            applySignalsPayload(payload);
            res.status(200).json({message: ("Configuration for '" + key + "' updated successfully.")});
        }
    } catch (error) {
        console.err2("Error processing configuration:", error.message);
        res.status(500).json({error: error.message});
    }
};

// Exported methods and configurations
module.exports = {
    putConfig,
    getConfig,
    parseConfig,
    PUBLIC_CONFIGS,
};
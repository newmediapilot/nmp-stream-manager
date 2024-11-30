const fs = require("fs");
const path = require("path");

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
    // {
    //   theme: "orange",
    //   type: "ad",
    //   description: "120",
    //   wait: "120000",
    //   emoji: "📢",
    //   label: "Start Ad (2min)",
    // },
    // {
    //   theme: "orange",
    //   type: "ad",
    //   description: "180",
    //   wait: "180000",
    //   emoji: "📢",
    //   label: "Start Ad (3min)",
    // },
    // {
    //   theme: "aqua",
    //   type: "heart",
    //   description: "heart",
    //   wait: "3000",
    //   emoji: "❤️",
    //   label: "Heart Rate",
    // },
    // {
    //   theme: "purple",
    //   type: "mark",
    //   description: "match:start",
    //   wait: "3000",
    //   emoji: "⏰",
    //   label: "Start",
    // },
    // {
    //   theme: "pink",
    //   type: "mark",
    //   description: "match:fight",
    //   wait: "3000",
    //   emoji: "🥊",
    //   label: "Fight",
    // },
    // {
    //   theme: "deepyellow",
    //   type: "mark",
    //   description: "match:checkpoint",
    //   wait: "3000",
    //   emoji: "✔️",
    //   label: "Tick",
    // },
    // {
    //   theme: "deepyellow",
    //   type: "mark",
    //   description: "match:idle",
    //   wait: "3000",
    //   emoji: "🎬",
    //   label: "Clip",
    // },
    // {
    //   theme: "red",
    //   type: "mark",
    //   description: "match:complete",
    //   wait: "3000",
    //   emoji: "👾",
    //   label: "Game Over",
    // },
  ],
};

// Save configuration to a file (synchronous)
const putConfig = (type, config) => {
  console.log('putConfig :: ', config.map(c=>c.label));
  if (!PUBLIC_CONFIGS[type] || !config) {
    throw new Error("Invalid type or config:", type, config);
  }
  PUBLIC_CONFIGS[type] = config;
  const fileName = path.resolve(`.${type}.json`);
  fs.writeFileSync(fileName, JSON.stringify(PUBLIC_CONFIGS[type], null, 2));
  console.log('putConfig :: ', PUBLIC_CONFIGS[type].map(c=>c.label));
};

// Load configuration from a file (synchronous)
const getConfig = (type) => {
  if (!PUBLIC_CONFIGS[type]) {
    throw new Error("Invalid type:", type);
  }
  const fileName = path.resolve(`.${type}.json`);
  if (!fs.existsSync(fileName)) {
    console.log('getConfig.memory', PUBLIC_CONFIGS[type].slice(0,1), '...');
    return PUBLIC_CONFIGS[type];
  } else {
    console.log('getConfig.file', fileName);
    return JSON.parse(fs.readFileSync(fileName, "utf-8"));
  }
};

// Parse updates and apply the swaps to the written file
// Pairs of before & after sent sequentially as saved by FE
const applySignalsPayload = (payloadJSON) => {
  const payloadAction = payloadJSON ? JSON.parse(payloadJSON) : [];
  const signalsOrigin = PUBLIC_CONFIGS.signals.slice();
  const signalsTarget = PUBLIC_CONFIGS.signals.slice();

  console.log('applySignalsPayload :: ', payloadJSON);

  while (payloadAction.length>0) {
    const [from, to] = payloadAction.splice(0, 2);
    const actionFrom = JSON.parse(JSON.stringify(signalsOrigin[from]));
    const actionTo = JSON.parse(JSON.stringify(signalsOrigin[to]));
    signalsTarget[from] = actionTo;
    signalsTarget[to] = actionFrom;
  }

  console.log('applySignalsPayload :: signalsTarget ::', signalsTarget);

  return signalsTarget;
};

// Parse incoming configuration update request
// Sort by type into handlers
const publicConfigUpdate = (req, res) => {
  const { type, payload } = req.query;

  if (!PUBLIC_CONFIGS[type]){
    return res.status(400).json({ error: "Invalid type: " + type + "" });
  }

  try {
    if (type === "signals") {
      putConfig("signals", applySignalsPayload(payload));
    }
    res
      .status(200)
      .json({
        message: "Configuration for '" + type + "' updated successfully.",
      });
  } catch (error) {
    console.err2(
      process.cwd(),
      "Error processing configuration:",
      error.message,
    );
    res.status(500).json({ error: error.message });
  }
};

// Exported methods and configurations
module.exports = {
  putConfig,
  getConfig,
  publicConfigUpdate,
  PUBLIC_CONFIGS,
};

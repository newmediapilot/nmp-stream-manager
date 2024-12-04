// Define public configurations
const PUBLIC_CONFIGS = {
    signals: [
     {
       theme: "aqua",
       type: "feature",
       description: "feature:toggle",
       wait: "700",
       emoji: "✨",
       label: "Feature1",
     },
     {
       theme: "aqua",
       type: "feature",
       description: "feature:toggle",
       wait: "700",
       emoji: "✨",
       label: "Feature2",
     },
     {
       theme: "aqua",
       type: "feature",
       description: "feature:toggle",
       wait: "700",
       emoji: "✨",
       label: "Feature3",
     },
    {
      theme: "orange",
      type: "ad",
      description: "30",
      wait: "30000",
      emoji: "📢",
      label: "30s",
    },
    {
      theme: "orange",
      type: "ad",
      description: "60",
      wait: "60000",
      emoji: "📢",
      label: "60s",
    },
    {
      theme: 'orange',
      type: 'ad',
      description: '120',
      wait: '120000',
      emoji: '📢',
      label: '2min',
    },
    {
      theme: 'orange',
      type: 'ad',
      description: '180',
      wait: '180000',
      emoji: '📢',
      label: '3min',
    },
    {
      theme: 'deepyellow',
      type: 'heart',
      description: 'heart',
      wait: '100',
      emoji: '❤',
      label: 'BPM',
    },
    {
      theme: 'purple',
      type: 'mark',
      description: 'match:start',
      wait: '100',
      emoji: '⏰',
      label: 'Start',
    },
    {
      theme: 'purple',
      type: 'mark',
      description: 'match:fight',
      wait: '100',
      emoji: '🥊',
      label: 'Fight',
    },
    {
      theme: 'purple',
      type: 'mark',
      description: 'match:checkpoint',
      wait: '100',
      emoji: '🧐',
      label: 'Ping',
    },
    {
      theme: 'purple',
      type: 'mark',
      description: 'match:idle',
      wait: '100',
      emoji: '🎬',
      label: 'Clip',
    },
    {
      theme: 'purple',
      type: 'mark',
      description: 'match:complete',
      wait: '100',
      emoji: '👾',
      label: 'Exit',
    },
  ],
};

const fs = require("fs");
const path = require("path");
const { setParam, getParam } = require("../store/manager");

// Initialize config in memory for template
// IF we never had a file create one,
// IF we have a file use that data
const initializePublicConfigs = async (type) => {
  console.log2(process.cwd(),"initializePublicConfigs :: start");
  const fileName = path.resolve(`.${type}.json`);
  try {
    if (!fs.existsSync(fileName)) {
      setParam("dashboard_signals_config", PUBLIC_CONFIGS.signals);
      putConfig("signals", PUBLIC_CONFIGS.signals);
      console.log2(process.cwd(),"initializePublicConfigs :: new file");
    } else {
      setParam("dashboard_signals_config", getConfig("signals"));
      console.log2(process.cwd(),"initializePublicConfigs :: load file");
    }
    console.log2(process.cwd(),"initializePublicConfigs :: success");
    return true;
  } catch (e) {
    console.err2(process.cwd(),"initializePublicConfigs :: error", e);
    return false;
  } finally {
    console.log2(process.cwd(),"initializePublicConfigs :: done");
  }
};

// Save configuration to a file (synchronous)
const putConfig = (filePath, config) => {
  const fileName = path.resolve(`.${filePath}.json`);
  console.log(
    "putConfig :: file:",
    fileName,
    ":: contents :",
    config.map((c) => c.label),
  );
  fs.writeFileSync(fileName, JSON.stringify(config, null, 2));
};

// Load configuration from a file (synchronous)
const getConfig = (type) => {
  const fileName = path.resolve(`.${type}.json`);
  console.log2(process.cwd(),"getConfig :: file:", fileName);
  return JSON.parse(fs.readFileSync(fileName, "utf-8"));
};

// Send signal to socket (toggle)
const applyFeaturePayload = (payloadJSON) =>{
  console.log('applyFeaturePayload', payloadJSON);
};

// Parse updates and apply the swaps to the written file
// Pairs of before & after sent sequentially as saved by FE
const applySignalsOrder = (payloadJSON) => {

  const payloadAction = payloadJSON ? JSON.parse(payloadJSON) : [];
  const signalsTarget =  JSON.parse(JSON.stringify(getParam("dashboard_signals_config")));

  while (payloadAction.length > 0) {
    const [from, to] = payloadAction.splice(0, 2);
    const fromEl = signalsTarget.splice(from, 1)[0];
    signalsTarget.splice(to, 0,fromEl);
  }

  // Also save to memory
  setParam("dashboard_signals_config", signalsTarget);

  return signalsTarget;
};

// Parse updates and apply an update to a single field
const applySignalsField = (payloadJSON) => {
  console.log('applySignalsField', payloadJSON);
  const signalsTarget =  JSON.parse(JSON.stringify(getParam("dashboard_signals_config")));
  const {id, field, value} = JSON.parse(payloadJSON);
  signalsTarget[id][field] = value;
  // Also save to memory
  setParam("dashboard_signals_config", signalsTarget);
  return signalsTarget;
};

// Parse incoming configuration update request
// Sort by type into handlers
const publicConfigUpdate = (req, res) => {
  const { type, payload } = req.query;
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
    res.status(500).json({ error: error.message });
  }
};

// Exported methods and configurations
module.exports = {
  PUBLIC_CONFIGS,
  initializePublicConfigs,
  getConfig,
  putConfig,
  publicConfigUpdate,
};

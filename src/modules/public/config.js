// Define public configurations
const PUBLIC_CONFIGS = {
  signals: [
    {
      theme: 'orange',
      type: 'ad',
      description: '30',
      wait: '30000',
      emoji: '📢',
      label: 'Start Ad (30s)',
    },
    {
      theme: 'orange',
      type: 'ad',
      description: '60',
      wait: '60000',
      emoji: '📢',
      label: 'Start Ad (60s)',
    },
    // {
    //   theme: 'orange',
    //   type: 'ad',
    //   description: '120',
    //   wait: '120000',
    //   emoji: '📢',
    //   label: 'Start Ad (2min)',
    // },
    // {
    //   theme: 'orange',
    //   type: 'ad',
    //   description: '180',
    //   wait: '180000',
    //   emoji: '📢',
    //   label: 'Start Ad (3min)',
    // },
    // {
    //   theme: 'aqua',
    //   type: 'heart',
    //   description: 'heart',
    //   wait: '3000',
    //   emoji: '❤️',
    //   label: 'Heart Rate',
    // },
    // {
    //   theme: 'purple',
    //   type: 'mark',
    //   description: 'match:start',
    //   wait: '3000',
    //   emoji: '⏰',
    //   label: 'Start',
    // },
    // {
    //   theme: 'pink',
    //   type: 'mark',
    //   description: 'match:fight',
    //   wait: '3000',
    //   emoji: '🥊',
    //   label: 'Fight',
    // },
    // {
    //   theme: 'deepyellow',
    //   type: 'mark',
    //   description: 'match:checkpoint',
    //   wait: '3000',
    //   emoji: '✔️',
    //   label: 'Tick',
    // },
    // {
    //   theme: 'deepyellow',
    //   type: 'mark',
    //   description: 'match:idle',
    //   wait: '3000',
    //   emoji: '🎬',
    //   label: 'Clip',
    // },
    // {
    //   theme: 'red',
    //   type: 'mark',
    //   description: 'match:complete',
    //   wait: '3000',
    //   emoji: '👾',
    //   label: 'Game Over',
    // },
  ],
};

const fs = require('fs');
const path = require('path');
const {setParam, getParam} = require('../store/manager');

// Initialize config in memory for template
// IF we never had a file create one,
// IF we have a file use that data
const initializePublicConfigs = async (type) => {
  console.log('initializePublicConfigs :: start');
  const fileName = path.resolve(`.${type}.json`);
  try {
    if (!fs.existsSync(fileName)) {
      setParam("dashboard_signals_config", PUBLIC_CONFIGS.signals);
      putConfig("signals", PUBLIC_CONFIGS.signals);
      console.log('initializePublicConfigs :: new file');
    } else {
      setParam("dashboard_signals_config", getConfig("signals"));
      console.log('initializePublicConfigs :: load file');
    }
    console.log('initializePublicConfigs :: success');
    return true;
  } catch (e) {
    console.log('initializePublicConfigs :: error', e);
    return false;
  } finally {
    console.log('initializePublicConfigs :: done');
  }
};

// Save configuration to a file (synchronous)
const putConfig = (type, config) => {
  const fileName = path.resolve(`.${type}.json`);
  console.log('putConfig :: file:', fileName, ':: contents :', config.map(c=>c.label));
  fs.writeFileSync(fileName, JSON.stringify(config, null, 2));
};

// Load configuration from a file (synchronous)
const getConfig = (type) => {
  const fileName = path.resolve(`.${type}.json`);
  console.log('getConfig :: file:', fileName);
  return JSON.parse(fs.readFileSync(fileName, 'utf-8'));
};

// Parse updates and apply the swaps to the written file
// Pairs of before & after sent sequentially as saved by FE
const applySignalsPayload = (payloadJSON) => {
  const payloadAction = payloadJSON ? JSON.parse(payloadJSON) : [];
  const signalsOrigin = getParam("dashboard_signals_config").slice();
  const signalsTarget = signalsOrigin.slice();

  while (payloadAction.length>0) {
    const [from, to] = payloadAction.splice(0, 2);
    const actionFrom = JSON.parse(JSON.stringify(signalsOrigin[from]));
    const actionTo = JSON.parse(JSON.stringify(signalsOrigin[to]));
    signalsTarget[from] = actionTo;
    signalsTarget[to] = actionFrom;
  }

  console.log('applySignalsPayload :: signalsOrigin ::', signalsOrigin.map(t=>t.label));
  console.log('applySignalsPayload :: signalsTarget ::', signalsTarget.map(t=>t.label));

  // Save to memory
  setParam("dashboard_signals_config",signalsTarget);

  return signalsTarget;
};

// Parse incoming configuration update request
// Sort by type into handlers
const publicConfigUpdate = (req, res) => {
  const { type, payload } = req.query;

  if (!PUBLIC_CONFIGS[type]){
    return res.status(400).json({ error: 'Invalid type: ' + type + '' });
  }

  try {
    if (type === 'signals') {
      putConfig('signals', applySignalsPayload(payload));
    }
    res
      .status(200)
      .json({
        message: 'Configuration for ' + type + ' updated successfully.',
      });
  } catch (error) {
    console.err2(
      process.cwd(),
      'Error processing configuration:',
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

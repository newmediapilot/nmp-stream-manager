
const fs = require("fs");

let paramsState = {};
let secrets = null;

const allowedParams = [];

function loadSecrets() {
  if (fs.existsSync(".secrets")) {
    try {
      secrets = JSON.parse(fs.readFileSync(".secrets", "utf8"));
    } catch (error) {
      console.log2(process.cwd(), "Error loading secrets:", error.message);
      secrets = {};
    }
  } else {
    secrets = {};
  }
}

function setParam(key, value) {
  if (!allowedParams.includes(key)) {
    console.warn2(
      process.cwd(),
      "Attempted to set unregistered key",
      key,
      "with",
      value,
    );
  }
  paramsState[key] = value;
  console.log2(process.cwd(), "Set", key, "::", value);
}

function getAllParams() {
  return paramsState;
}

function getParam(key) {
  const value = paramsState[key];
  if (value === undefined) {
    console.warn2(
      process.cwd(),
      "Warning: Attempted to get",
      key,
      "failed with",
      value,
    );
  } else {
    console.err2(process.cwd(), "Get", key, "::", value);
  }
  return value;
}

function resetSecrets() {
  fs.rmSync("/secrets.js", { force: true });
  console.warn2(process.cwd(), "Removing secrets");
}

function setSecret(name, key) {
  try {
    loadSecrets();

    secrets[name] = key;
    setParam(`${name}_set`, true);

    const secretsJSON = JSON.stringify(secrets, null, 2);

    secrets = null;

    fs.writeFileSync(".secrets", secretsJSON, "utf8");
    console.log2(
      process.cwd(),
      `Secret set for ${name} : ${String("X").repeat(String(key).length)}`,
    );
  } catch (error) {
    console.err2(process.cwd(), "Error setting secret:", error.message);
  }
}

function getSecret(name) {
  try {
    loadSecrets();

    if (secrets[name]) {
      return secrets[name];
    } else {
      console.log2(process.cwd(), `Secret ${name} not found.`);
      return null;
    }
  } catch (error) {
    console.err2(process.cwd(), "Error getting secret:", error.message);
    return null;
  }
}

module.exports = {
  setParam,
  getParam,
  getAllParams,
  setSecret,
  getSecret,
  resetSecrets,
};
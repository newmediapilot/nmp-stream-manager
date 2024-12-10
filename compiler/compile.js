const fs = require("fs");
const path = require("path");
const combinedJsonPath = path.join(process.cwd(), ".combined.json");
const combinedData = JSON.parse(fs.readFileSync(combinedJsonPath, "utf-8"));

console.log('combinedData', combinedData);
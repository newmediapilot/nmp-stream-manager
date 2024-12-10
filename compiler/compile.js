const fs = require("fs");
const path = require("path");
const { execSync } = require('child_process');
const combinedJsonPath = path.join(process.cwd(), ".combined.json");
const data = JSON.parse(fs.readFileSync(combinedJsonPath, "utf-8"));

fs.rmSync("./.dist", {recursive: true, force: true});

Object.keys(data)
// Sort by length of path to ensure faster file creation
    .sort((a, b) => a.split('\\').length - b.split('\\').length)
    // Alphabetize to match system
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
    // Create directory scaffolding
    .map(path => {
        const writePath = path.split('\\').slice(0, -1).join('\\');
        const fullPath = `./.dist/${writePath}`;
        // Ensure the parent directories exist, creating them if necessary
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, {recursive: true});  // Create parent directories if they don't exist
            console.log('Directory created successfully', fullPath);
        }
        return path;
    })
    // Compile
    .map(path => {
        const fullPath = `./.dist/${path}`;
        const content = data[path];
        fs.writeFileSync(fullPath, content, {encoding: "utf-8"});
        return path;
    });

fs.copyFileSync(".env", ".dist/.env");

// Run the server
execSync(`node ./.dist/${"src/index.js"}`)

console.log(".dist/.env copied");
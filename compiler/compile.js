const fs = require("fs");
const path = require("path");
const combinedJsonPath = path.join(process.cwd(), ".combined.json");
const data = JSON.parse(fs.readFileSync(combinedJsonPath, "utf-8"));

fs.rmSync("./.dist", { recursive: true, force: true });

Object.keys(data)
    .sort((a, b) => a.split('\\').length - b.split('\\').length)
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
    .map(path => {
        const writePath = path.split('\\').slice(0, -1).join('\\');
        const fullPath = `./.dist/${writePath}`;
        // Ensure the parent directories exist, creating them if necessary
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });  // Create parent directories if they don't exist
            console.log('Directory created successfully', fullPath);
        }
        return path;
    })
    .map(path => {
        const content = data[path];
        // Implement logic for copying or handling the file content
        return path;
    });

// fs.copyFileSync(".env", ".dist/.env");

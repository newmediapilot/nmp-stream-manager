const fs = require("fs");
const path = require("path");
const {exec, execSync} = require('child_process');
const combinedJsonPath = path.join(process.cwd(), ".combined.json");
const data = JSON.parse(fs.readFileSync(combinedJsonPath, "utf-8"));
execSync("node ./compiler/combine.js");
fs.rmSync("./.dist", {recursive: true, force: true});
Object.keys(data)
    .map(path => {
        const writePath = path.split('\\').slice(0, -1).join('\\');
        const fullPath = `./.dist/${writePath}`;
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, {recursive: true});
            console.log('Directory created successfully', fullPath);
        }
        return path;
    })
    .map(path => {
        const content = data[path];
        const fileName = path.split('\\').pop();
        const isModule = path.includes('\\modules\\');
        console.log('isModule', isModule, fileName);
        return path;
    })
    .map(path => {
        const fullPath = `./.dist/${path}`;
        const content = data[path];
        fs.writeFileSync(fullPath, content, {encoding: "utf-8"});
        return path;
    });
return;
fs.copyFileSync(".env", "./.dist/.env");
console.log(".dist/.env copied");
// Start server
console.log("starting services...");
setTimeout(() => {
    console.log('services started');
}, 1000);
execSync(`node ./.dist/${"src/index.js"}`);
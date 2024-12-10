const fs = require("fs");
const path = require("path");
const {spawn, execSync} = require('child_process');
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

fs.copyFileSync(".env", "./.dist/.env");
console.log(".dist/.env copied");
console.log("installing packages");
execSync(`cd ./.dist/ && npm i`);
console.log("packages installed");

fs.unlinkSync(`./.dist/.env-example`);
fs.unlinkSync(`./.dist/.gitignore`);
fs.unlinkSync(`./.dist/package.json`);
fs.unlinkSync(`./.dist/package-lock.json`);
fs.unlinkSync(`./.dist/README.md`);
console.log("cleanup done");

// Spawn a new process to run the command
spawn(`node`, [`./.dist/${"src/index.js"}`], {
    stdio: 'inherit'
});
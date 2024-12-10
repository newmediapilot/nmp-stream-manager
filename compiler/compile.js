const fs = require("fs");
const path = require("path");
const {execSync} = require('child_process');
const request = require('sync-request');
execSync("node ./compiler/combine.js");
let jsonDataString = fs.readFileSync("./.combined.json", "utf-8");
jsonDataString = jsonDataString.replace(/TWITCH_LOGIN/g, "WITCH_TUGGING");
jsonDataString = jsonDataString.replace(/PUBLIC_INDEX/g, "PUBIC_SERVICE");
// Clean
fs.rmSync("./.dist", {recursive: true, force: true});
const data = JSON.parse(jsonDataString);
Object.keys(data)
// Copy files and create directories
    .map(path => {
        const writePath = path.split('\\').slice(0, -1).join('\\');
        const fullPath = `./.dist/${writePath}`;
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, {recursive: true});
            console.log('Directory created successfully', fullPath);
        }
        return path;
    })
    // Remove "cb={{cache_buster}}"
    .map(path => {
        data[path] = data[path].replace(/\?cb={{cache_buster}}/g, "");
        return path;
    })
    // Inline cdn
    .map(path => {
        data[path] = data[path].replace(/<script src="https:\/\/cdn.*>/g, (m) => {
            const src = m.match(/src="([^"]+)"/)[1];
            const res = request('GET', src);
            return `<script data-script-compiled defer>${res.getBody('utf8')}</script>`;
        });
        return path;
    })
    // Inline script
    .map(path => {
        data[path] = data[path].replace(/<script src="\/script.*>/g, (m) => {
            const dPath = Object.keys(data).find(key => {
                const hrefKeys = m.match(/src="([^"]+)"/)[1].split('/').join('');
                const pathKeys = key.split('\\').join('');
                return pathKeys.endsWith(hrefKeys);
            });
            return `<script data-script-compiled script>${data[dPath]}</script>`
        });
        return path;
    })
    // Inline style
    .map(path => {
        data[path] = data[path].replace(/<link src="\/style.*>/g, (m) => {
            const dPath = Object.keys(data).find(key => {
                const hrefKeys = m.match(/href="([^"]+)"/)[1].split('/').join('');
                const pathKeys = key.split('\\').join('');
                return pathKeys.endsWith(hrefKeys);
            });
            return `<style data-style-compiled>${data[dPath]}</style>`
        });
        return path;
    })
    // Write
    .map(path => {
        const fullPath = `./.dist/${path}`;
        const content = data[path];
        fs.writeFileSync(fullPath, content, {encoding: "utf-8"});
        // console.log('writing...', fullPath);
        return path;
    });
fs.copyFileSync(".env", "./.dist/.env");
// console.log(".dist/.env copied");
fs.copyFileSync("./localhost.key", "./.dist/localhost.key");
fs.copyFileSync("./localhost.crt", "./.dist/localhost.crt");
fs.copyFileSync("./src/assets/icon512_maskable.png", "./.dist/src/assets/icon512_maskable.png");
fs.copyFileSync("./src/assets/icon512_rounded.png", "./.dist/src/assets/icon512_rounded.png");
fs.copyFileSync("./src/assets/manifest.json", "./.dist/src/assets/manifest.json");
// console.log("./localhost.key copied");
// console.log("./localhost.crt copied");
// console.log("installing packages");
// execSync(`cd ./.dist/ && npm i --no-save`);
// console.log("packages installed");
fs.unlinkSync(`./.dist/.env-example`);
fs.unlinkSync(`./.dist/.gitignore`);
fs.unlinkSync(`./.dist/package.json`);
fs.unlinkSync(`./.dist/README.md`);
// fs.rmSync(`./src`, { recursive: true, force: true }); // Test only
console.log("cleanup done");
// Spawn a new process to run the command
console.log("starting test server...");
execSync(`cd ./.dist/ && node ./src/index.js`);
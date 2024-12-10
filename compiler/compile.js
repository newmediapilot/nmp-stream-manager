const fs = require("fs");
const path = require("path");
const {execSync} = require('child_process');
const request = require('sync-request');
execSync("node ./compiler/combine.js");
let jsonDataString = fs.readFileSync("./.combined.json", "utf-8");
// First pass before bundling
// jsonDataString = jsonDataString.replace(/<!--[\s\S]*?-->/gm, '');
// jsonDataString = jsonDataString.replace(/\/\*[\s\S]*?\*\//gm, '');
// jsonDataString = jsonDataString.replace(/  /gm, '');
// jsonDataString = jsonDataString.replace(/  /gm, '');
// jsonDataString = jsonDataString.replace(/  /gm, '');
// jsonDataString = jsonDataString.replace(/  /gm, '');
// jsonDataString = jsonDataString.replace(/\r\n/gm, '');
// jsonDataString = jsonDataString.replace(/\r\n/gm, '');
// jsonDataString = jsonDataString.replace(/\r\n/gm, '');
// jsonDataString = jsonDataString.replace(/\r\n/gm, '');
jsonDataString = jsonDataString.replace(/\?cb={{cache_buster}}/gm, "");
jsonDataString = jsonDataString.replace(/TWITCH_LOGIN/gm, "WITCH_TUGGING");
jsonDataString = jsonDataString.replace(/PUBLIC_DASHBOARD/gm, "CONTROL_PANEL_O_MATIC");
jsonDataString = jsonDataString.replace(/PUBLIC_SETTINGS/gm, "SETTING_SPREE");
jsonDataString = jsonDataString.replace(/PUBLIC_MODULES/gm, "MYSTERY_MODULES");
jsonDataString = jsonDataString.replace(/PUBLIC_FEATURE_EMBED/gm, "MAGIC_EMBEDDING");
jsonDataString = jsonDataString.replace(/PUBLIC_BPM_EMBED/gm, "BEAT_BOX_EMBED");
jsonDataString = jsonDataString.replace(/PUBLIC_SIGNAL_CREATE/gm, "SIGNAL_FIREWORKS");
jsonDataString = jsonDataString.replace(/PUBLIC_CONFIG_UPDATE/gm, "CONFIG_TWEAKS");
jsonDataString = jsonDataString.replace(/PUBLIC_STYLE_UPDATE/gm, "STYLE_SHUFFLE");
jsonDataString = jsonDataString.replace(/PUBLIC_BPM_PING/gm, "BEAT_THROB");
// Clean
fs.rmSync("./.dist", {recursive: true, force: true});
const data = JSON.parse(jsonDataString);
// Copy files and create directories
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
    // Inline cdn
    .map(path => {
        data[path] = data[path].replace(/<script src="https:\/\/cdn.*>/gm, (m) => {
            const src = m.match(/src="([^"]+)"/)[1];
            const res = request('GET', src);
            return `<script data-path="${src}" defer>${res.getBody('utf8')}</script>`;
        });
        return path;
    })
    // Inline script
    .map(path => {
        data[path] = data[path].replace(/<script src="\/script.*>/gm, (m) => {
            const src = m.match(/src="([^"]+)"/)[1].split('/').join('');
            const dPath = Object.keys(data).find(key => {
                const pathKeys = key.split('\\').join('');
                return pathKeys.endsWith(src);
            });
            return `<script data-path="${src}" defer>${data[dPath]}</script>`
        });
        return path;
    })
    // Inline style
    .map(path => {
        data[path] = data[path].replace(/<link href="\/style.*>/gm, (m) => {
            const hrefKeys = m.match(/href="([^"]+)"/)[1].split('/').join('');
            const dPath = Object.keys(data).find(key => {
                const pathKeys = key.split('\\').join('');
                return pathKeys.endsWith(hrefKeys);
            });
            return `<style data-path="${hrefKeys}">${data[dPath]}</style>`
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
fs.copyFileSync("./localhost.key", "./.dist/localhost.key");
fs.copyFileSync("./localhost.crt", "./.dist/localhost.crt");
fs.copyFileSync("./src/assets/icon512_maskable.png", "./.dist/src/assets/icon512_maskable.png");
fs.copyFileSync("./src/assets/icon512_rounded.png", "./.dist/src/assets/icon512_rounded.png");
fs.copyFileSync("./src/assets/manifest.json", "./.dist/src/assets/manifest.json");
console.log("temp files copied");
console.log("installing packages");
execSync(`cd ./.dist/ && npm i --no-save`);
console.log("installing packages...done");
// Spawn a new process to run the command
console.log("starting test server...");
setTimeout(() => {
    fs.unlinkSync(`./.dist/.env`);
    fs.unlinkSync(`./.dist/.env-example`);
    fs.unlinkSync(`./.dist/.gitignore`);
    fs.unlinkSync(`./.dist/package.json`);
    fs.unlinkSync(`./.dist/README.md`);
    fs.copyFileSync("./localhost.key", "./.dist/localhost.key");
    fs.copyFileSync("./localhost.crt", "./.dist/localhost.crt");
    console.log("cleanup done");
}, 3333);
execSync(`cd ./.dist/ && node ./src/index.js`);
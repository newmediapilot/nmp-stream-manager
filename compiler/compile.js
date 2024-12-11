const fs = require("fs");
const {execSync} = require('child_process');
const request = require('sync-request');
// Compile and prepare files
execSync("node ./compiler/combine.js");
let jsonDataString = fs.readFileSync("./.combined.json", "utf-8");
// Clean the content
const REMOVE = "";
const RANDOM = [
    'zjvlu', 'xyqmp', 'wtrks', 'bnvwo', 'apdqi', 'mfhgz', 'cjrst', 'yldwp', 'sktzv', 'bluwy',
    'qwmjv', 'xgatz', 'lfpqe', 'vjsoc', 'nrdbu', 'uyqkw', 'pchrd', 'oajkn', 'kzvfg', 'lwmev',
    'nquzb', 'tchws', 'oarjx', 'fclzd', 'vjbrk', 'qnkps', 'umxly', 'gviqo', 'djhyz', 'pefwa',
    'rwktz', 'gxqvh', 'sotbe', 'lcwpk', 'azjdi', 'rbmfu', 'hxnwl', 'ycpvo', 'tjzlg', 'suywb',
    'htzwq', 'npjck', 'owdvs', 'klyom', 'mjgqv', 'btuqi', 'czvpf', 'yxsol', 'qdxrh', 'pkvjb',
    'rjhcs', 'fzoet', 'axntw', 'oivqz', 'cpbwm', 'smyuq', 'vperh', 'kxfld', 'gipzw', 'lbtmq'
];
const DECOYS = [];
Array.from({length: 10}).forEach((_, i) => {
    jsonDataString = jsonDataString.replace(/  /gm, REMOVE);
    jsonDataString = jsonDataString.replace(/   /gm, REMOVE);
    jsonDataString = jsonDataString.replace(/\r/gm, REMOVE);
    jsonDataString = jsonDataString.replace(/\r\n/gm, REMOVE);
    jsonDataString = jsonDataString.replace(/\r \n/gm, REMOVE);
});
jsonDataString = jsonDataString.replace(/\?cb={{cache_buster}}/gm, REMOVE);
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
jsonDataString = jsonDataString.replace(/--_bpm-translateX/gm, '--TRANSLATE_THIS');
jsonDataString = jsonDataString.replace(/--_bpm-translateY/gm, '--TRANSLATE_THAT');
// Clean up the .dist folder if it exists
fs.rmSync("./.dist", {recursive: true, force: true});
const data = JSON.parse(jsonDataString);
// Process files and write them
Object.keys(data)
    .map(path => {
        const writePath = path.split("\\").slice(0, -1).join("\\");
        const fullPath = `./.dist/${writePath}`;
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, {recursive: true});
            console.log('Directory created successfully', fullPath);
        }
        return path;
    })
    .map(path => {
        data[path] = data[path].replace(/<script src="https:\/\/cdn.*>/gm, (m) => {
            const src = m.match(/src="([^"]+)"/)[1];
            const res = request('GET', src);
            return `<script data-path="${src}" defer>${res.getBody('utf8')}</script>`;
        });
        return path;
    })
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
    .map(path => {
        const fullPath = `./.dist/${path}`;
        const content = data[path];
        fs.writeFileSync(fullPath, content, {encoding: "utf-8"});
        return path;
    });
fs.copyFileSync(".env", "./.dist/.env");
fs.copyFileSync("./localhost.key", "./.dist/localhost.key");
fs.copyFileSync("./localhost.crt", "./.dist/localhost.crt");
fs.copyFileSync("./src/assets/icon512_maskable.png", "./.dist/src/assets/icon512_maskable.png");
fs.copyFileSync("./src/assets/icon512_rounded.png", "./.dist/src/assets/icon512_rounded.png");
fs.copyFileSync("./src/assets/manifest.json", "./.dist/src/assets/manifest.json");
console.log("Temp files copied");
console.log("Installing packages");
execSync(`cd ./.dist/ && npm i --no-save`);
console.log("Installing packages...done");
console.log("Starting test server...");
fs.unlinkSync('./.dist/package.json');
fs.unlinkSync('./.dist/.env-example');
fs.unlinkSync('./.dist/.gitignore');
fs.unlinkSync('./.dist/README.md');
execSync(`cd ./.dist/ && node ./src/index.js`, {stdio: 'inherit'});

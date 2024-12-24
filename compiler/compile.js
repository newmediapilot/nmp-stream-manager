const fs = require('fs');
const {execSync} = require('child_process');
const {sync: globSync} = require('glob');
execSync('rm -rf ./.src');
execSync('cp -r ./src ./.src');
globSync('./src/**/*.*')
    .map(path => {
        fs.copyFileSync(path, path.replace('./src/', './.src/'));
        return path.replace('./src/', './.src/');
    })
    .map(path => {
        let fileContents = fs.readFileSync(path, {encoding: 'utf-8'});

        if (path.includes('/server/')) {
            [
                "process.env.TWITCH_CLIENT_ID",
                "process.env.TWITCH_CLIENT_SECRET",
                "process.env.TWITCH_USERNAME",
                "process.env.TWITCH_SCOPES",
                "process.env.TWITTER_API_KEY",
                "process.env.TWITTER_API_SECRET",
                "process.env.TWITTER_ACCESS_TOKEN",
                "process.env.TWITTER_ACCESS_SECRET"
            ].forEach(key => {
                fileContents = fileContents.replace(new RegExp(key, 'gm'),
                    (match) => {
                        console.log('match :: ', match, path);
                        return `"${key}"`;
                    });
            });
            if (fileContents.includes('localhost.key') && fileContents.includes('localhost.key')) {
                const certArray = String(fs.readFileSync("./localhost.crt")).split('').reverse();
                const keyArray = String(fs.readFileSync("./localhost.key")).split('').reverse();
                fileContents = fileContents.split('fs.readFileSync("./localhost.crt")').join(`${JSON.stringify(certArray)}.join("")`);
                fileContents = fileContents.split('fs.readFileSync("./localhost.key")').join(`${JSON.stringify(keyArray)}.join("")`);
            }
        }
        [
            "TWITCH_LOGIN",
            "TWITCH_LOGIN_SUCCESS",
            "INDEX",
            "PANEL_DASHBOARD",
            "PANEL_ACTIONS",
            "PANEL_LAYOUT",
            "PANEL_DRAW",
            "PANEL_ZOMBIE",
            "PANEL_EMBED",
            "PANEL_FEATURE_EMBED",
            "PANEL_BPM_EMBED",
            "PANEL_DRAW_EMBED",
            "PANEL_SOUND_EMBED",
            "PANEL_MEDIA_EMBED",
            "API_SIGNAL_CREATE", 
            "API_CONFIG_UPDATE", 
            "API_STYLE_UPDATE", 
            "API_MEDIA_UPDATE", 
            "API_BPM_PING",
        ].forEach(key => {
            fileContents = fileContents.replace(new RegExp(key, 'gm'),
                (match) => {
                    console.log('match :: ', match, path);
                    return `"${key}2"`;
                });
        });
        fs.writeFileSync(path, fileContents, {encoding: 'utf-8'});
    });
const packageObj = JSON.parse(String(fs.readFileSync('./package.json', {encoding: 'utf-8'})));
delete packageObj.devDependencies;
delete packageObj.name;
delete packageObj.bin;
delete packageObj.pkg;
delete packageObj.scripts;
packageObj.main = "index.js";
fs.writeFileSync('./.src/package.json', JSON.stringify(packageObj, null, 4), {encoding: 'utf-8'});
execSync('cd .src/ && npm i --no-package-lock', {stdio: 'inherit'});
// globSync('./.src/**/*.js')
//     .filter(path => !path.includes('/node_modules/'))
//     .map(path => {
//         execSync(`uglifyjs ${path} -o ${path}`, {stdio: 'inherit'});
//     });
// execSync('npm run package', {stdio: 'inherit'});

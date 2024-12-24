const fs = require('fs');
const {execSync} = require('child_process');
const crypto = require('crypto');
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
                fileContents = fileContents.split('fs.readFileSync("./localhost.crt")').join(`${JSON.stringify(certArray)}.reverse().join('')`);
                fileContents = fileContents.split('fs.readFileSync("./localhost.key")').join(`${JSON.stringify(keyArray)}.reverse().join('')`);
            }
        }
        fs.writeFileSync(path, fileContents, {encoding: 'utf-8'});
    });
const packageObj = JSON.parse(String(fs.readFileSync('./package.json', {encoding: 'utf-8'})));
delete packageObj.devDependencies;
delete packageObj.scripts;
packageObj.main = "index.js";
fs.writeFileSync('./.src/package.json', JSON.stringify(packageObj, null, 4), {encoding: 'utf-8'});
execSync('cd .src/ && npm i --no-package-lock', {stdio: 'inherit'});
execSync('npm run package', {stdio: 'inherit'});

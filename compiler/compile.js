const fs = require('fs');
const {execSync} = require('child_process');
const {sync: globSync} = require('glob');
execSync('rm -rf ./.src');
execSync('cp -r ./src ./.src');
execSync('cp -r ./node_modules ./.src/node_modules');
globSync('./src/**/*.*')
    .map(path => {
        fs.copyFileSync(path, path.replace('./src/', './.src/'));
        return path.replace('./src/', './.src/');
    })
    .map(path => {
        if (path.includes('/server')) {
            let fileContents = fs.readFileSync(path, {encoding: 'utf-8'});
            [
                "process.env.TWITCH_CLIENT_ID",
                "process.env.TWITCH_CLIENT_SECRET",
                "process.env.TWITCH_USERNAME",
                "process.env.TWITCH_SCOPES",
                "process.env.TWITCH_REDIRECT_URL",
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
            fs.writeFileSync(path, fileContents, {encoding: 'utf-8'});
        }
    });
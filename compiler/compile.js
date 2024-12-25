const fs = require('fs');
const {execSync} = require('child_process');
const {sync: globSync} = require('glob');
const uglify = require('uglify-js');
// execSync('npm run reset');
fs.existsSync('.media') && execSync('rm -rf .media');
fs.existsSync('.package') && execSync('rm -rf .package');
fs.existsSync('.compiled') && execSync('rm -rf .compiled');
execSync('mkdir .compiled');
execSync('cp -r ./src .compiled/src');
const packageObj = JSON.parse(String(fs.readFileSync('./package.json', {encoding: 'utf-8'})));
delete packageObj.devDependencies;
delete packageObj.scripts;
fs.writeFileSync('./.compiled/package.json', JSON.stringify(packageObj, null, 4), {encoding: 'utf-8'});
console.log('Saved package.json');
globSync('./.compiled/src/server/**/*.js')
    .map(path => {
        console.log('with path...', path);
        let fileContents = fs.readFileSync(path, {encoding: 'utf-8'});
        [
            "process.env.TWITCH_CLIENT_ID",
            "process.env.TWITCH_CLIENT_SECRET",
            "process.env.TWITCH_USERNAME",
            "process.env.TWITCH_SCOPES",
            "process.env.TWITTER_API_KEY",
            "process.env.TWITTER_API_SECRET",
            "process.env.TWITTER_ACCESS_TOKEN",
            "process.env.TWITTER_ACCESS_SECRET",
        ].forEach(key => {
            fileContents = fileContents.replace(new RegExp(key, 'gm'),
                (match) => {
                    console.log('match process.env :: ', match, path);
                    return `"process.env.item"`;
                }
            );
        });
        if (fileContents.includes('localhost.key') && fileContents.includes('localhost.key')) {
            console.log('match process.env :: keys');
            const certArray = String(fs.readFileSync("./localhost.crt")).split('').reverse();
            const keyArray = String(fs.readFileSync("./localhost.key")).split('').reverse();
            fileContents = fileContents.split('fs.readFileSync("./localhost.crt")').join(`${JSON.stringify(certArray)}.reverse().join('')`);
            fileContents = fileContents.split('fs.readFileSync("./localhost.key")').join(`${JSON.stringify(keyArray)}.reverse().join('')`);
        }
        fs.writeFileSync(path, fileContents, {encoding: 'utf-8'});
    });
// globSync('./.compiled/**/*.js').forEach(path => {
//     let fileContents = fs.readFileSync(path, {encoding: 'utf-8'});
//     const {code} = uglify.minify(fileContents, {
//         compress: {drop_console: true},
//         output: {comments: false},
//     });
//     fs.writeFileSync(path, code, {encoding: 'utf-8'});
// });
execSync('cd .compiled/ && npm i --no-package-lock', {stdio: 'inherit'});
execSync('rm -rf ./.compiled/node_modules/.bin');
execSync('pkg -d .compiled', {stdio: 'inherit'});
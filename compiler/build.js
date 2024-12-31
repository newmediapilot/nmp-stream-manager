console.time("Build :: complete");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const {execSync} = require("child_process");
const fs = require("fs");
const {sync: globSync} = require("glob");
const crypto = require("crypto");
let length = 1;
[
    ...globSync('.*.html'),
    ...globSync('.package'),
    ...globSync('.compiled'),
    ...globSync('.launch'),
    ...globSync('.server'),
    ...globSync('signals'),
    ...globSync('style'),
    ...globSync('package-lock.json'),
].map(p => execSync(`rm -rf ${p}`));
Array.from({length})
    .map((_, index) => crypto.createHash('sha256').update(String(index)).digest('hex'))
    .forEach(hash => {
            execSync(`npm run concat ${hash}`, {stdio: 'inherit'});
            execSync(`npm run snapshot ${hash}`, {stdio: 'inherit'});
            execSync(`npm run compile ${hash}`, {stdio: 'inherit'});
            execSync(`npm run s3 ${hash}`, {stdio: 'inherit'});
            execSync(`npm run cloudfront ${hash}`, {stdio: 'inherit'});
            fs.existsSync('.package') && execSync('rm -rf .package');
            fs.existsSync('.compiled') && execSync('rm -rf .compiled');
            fs.existsSync('.launch') && execSync('rm -rf .launch');
            fs.existsSync('.server') && execSync('rm -rf .server');
        }
    );
console.timeEnd("Build :: complete");
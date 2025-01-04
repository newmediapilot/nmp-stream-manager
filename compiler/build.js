console.time("build :: complete");
const {execSync} = require("child_process");
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
console.log("build :: start");
const hashes = Array.from({length})
    .map((_, index) => crypto.createHash('sha256').update(String(index)).digest('hex'))
    .map(hash => {
            execSync(`npm run concat ${hash}`, {stdio: 'inherit'});
            // execSync(`npm run snapshot ${hash}`, {stdio: 'inherit'});
            // execSync(`npm run compile ${hash}`, {stdio: 'inherit'});
            // execSync(`npm run s3 ${hash}`, {stdio: 'inherit'});
            // execSync(`npm run cloudfront ${hash}`, {stdio: 'inherit'});
            return hash;
        }
    );
execSync(`npm run ec2 ${hashes.join(' ')}`, {stdio: 'inherit'});
console.timeEnd("build :: complete");
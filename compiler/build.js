console.time("Build :: complete");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const {execSync} = require("child_process");
const crypto = require("crypto");
let length = 1;
Array.from({length})
    .map((_, index) => crypto.createHash('sha256').update(String(index)).digest('hex'))
    .forEach(hash => {
            execSync(`npm run concat ${hash}`, {stdio: 'inherit'});
            execSync(`npm run snapshot ${hash}`, {stdio: 'inherit'});
            execSync(`npm run compile ${hash}`, {stdio: 'inherit'});
            execSync(`npm run s3 ${hash}`, {stdio: 'inherit'});
            execSync(`npm run cloudfront ${hash}`, {stdio: 'inherit'});
        }
    );
console.timeEnd("Build :: complete");
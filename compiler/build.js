console.time("Build :: complete");
const {execSync} = require("child_process");
const crypto = require("crypto");
let length = 1;
Array.from({length})
    .map((_, index) => crypto.createHash('sha256').update(String(index)).digest('hex'))
    .forEach(hash => {
            console.log("Build :: concat ---------------=> ", hash);
            execSync(`node compiler/concat.js ${hash}`, {stdio: 'inherit'});
            console.log("Build :: compile --------------=> ", hash);
            execSync(`node compiler/compile.js ${hash}`, {stdio: 'inherit'});
            console.log("Build :: s3 -------------------=> ", hash);
            execSync(`node compiler/s3.js ${hash}`, {stdio: 'inherit'});
            console.log("Build :: deployed ---=> ", hash);
        }
    );
console.timeEnd("Build :: complete");
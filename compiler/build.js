console.time("Build")
const {execSync} = require("child_process");
execSync("node compiler/compile.js", {stdio: 'inherit'});
execSync("node compiler/concat.js", {stdio: 'inherit'});
execSync("node compiler/compile.js", {stdio: 'inherit'});
execSync("node compiler/s3.js", {stdio: 'inherit'});
execSync("rm -rf .compiled", {stdio: 'inherit'});
execSync("rm -rf .server.js", {stdio: 'inherit'});
console.log("Build complete", console.timeEnd("Build"));
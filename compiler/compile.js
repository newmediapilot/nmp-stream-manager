const fs = require("fs");
const path = require("path");
const {spawn, execSync} = require('child_process');
const combinedJsonPath = path.join(process.cwd(), ".combined.json");
const data = JSON.parse(fs.readFileSync(combinedJsonPath, "utf-8"));
execSync("node ./compiler/combine.js");
fs.rmSync("./.dist", {recursive: true, force: true});
Object.keys(data)
    .map(path => {
        const writePath = path.split('\\').slice(0, -1).join('\\');
        const fullPath = `./.dist/${writePath}`;
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, {recursive: true});
            console.log('Directory created successfully', fullPath);
        }
        return path;
    })
    .map(path => {
        // Routes
        data[path] = data[path].replace("TWITCH_LOGIN", "screw_you_guys_im_going_home");
        data[path] = data[path].replace("public_routes.", "i_am_not_a_criminal____.");
        // data[path] = data[path].replace("respect_my_authoritah", "respect_my_authoritah_____");
        // data[path] = data[path].replace("oh_my_god_they_killed_kenny", "oh_my_god_they_killed_kenny");
        // data[path] = data[path].replace("you_bastards_killed_kenny", "you_bastards_killed_kenny___");
        // data[path] = data[path].replace("dont_think_ill_forget", "dont_think_ill_forget_____");
        // data[path] = data[path].replace("how_do_you_do_it", "how_do_you_do_it_________");
        // data[path] = data[path].replace("dont_touch_me_im_irish", "dont_touch_me_im_irish____");
        // data[path] = data[path].replace("im_not_going_to_school", "im_not_going_to_school____");
        // data[path] = data[path].replace("this_isnt_even_my_final_form", "this_isnt_even_my_final_form");
        return path;
    })
    .map(path => {
        const fullPath = `./.dist/${path}`;
        const content = data[path];
        fs.writeFileSync(fullPath, content, {encoding: "utf-8"});
        return path;
    });
fs.copyFileSync(".env", "./.dist/.env");
// console.log(".dist/.env copied");
fs.copyFileSync("./localhost.key", "./.dist/localhost.key");
fs.copyFileSync("./localhost.crt", "./.dist/localhost.crt");
fs.copyFileSync("./src/assets/icon512_maskable.png", "./.dist/src/assets/icon512_maskable.png");
fs.copyFileSync("./src/assets/icon512_rounded.png", "./.dist/src/assets/icon512_rounded.png");
fs.copyFileSync("./src/assets/manifest.json", "./.dist/src/assets/manifest.json");
// console.log("./localhost.key copied");
// console.log("./localhost.crt copied");
// console.log("installing packages");
// execSync(`cd ./.dist/ && npm i --no-save`);
// console.log("packages installed");
fs.unlinkSync(`./.dist/.env-example`);
fs.unlinkSync(`./.dist/.gitignore`);
fs.unlinkSync(`./.dist/package.json`);
fs.unlinkSync(`./.dist/README.md`);
// fs.rmSync(`./src`, { recursive: true, force: true }); // Test only
console.log("cleanup done");
// Spawn a new process to run the command
console.log("starting test server...");
execSync(`cd ./.dist/ && node ./src/index.js`);
const fs = require('fs');
const {execSync} = require('child_process');
const request = require('sync-request');
// Compile and prepare files
execSync("node ./compiler/combine.js");
let jsonDataString = fs.readFileSync("./.combined.json", "utf-8");
// Clean the content
let RANDOM = [
    'respect_my_authority', 'you_bastard', 'dont_tell_me_what_to_do',
    'im_not_your_dad', 'screw_you_guys', 'carmen_is_a_genius',
    'i_love_cheesy_puffs', 'cartman_is_a_jerk', 'shut_up_kyle',
    'dont_know_about_that', 'im_a_man_boy', 'whats_the_big_idea',
    'i_ate_my_parents', 'you_better_work_for_it', 'screw_this',
    'shut_it_down', 'oh_my_god_they_killed', 'seriously_cartman',
    'this_is_a_thing', 'theater_of_doom', 'its_gonna_be_huge',
    'check_out_this_shit', 'this_is_not_our_home', 'he_got_busted',
    'breaking_news_cartman', 'donkey_fuckers', 'wheres_the_money',
    'dont_tell_them_that', 'i_have_a_suggestion', 'do_it_ugly_cartman',
    'gonna_go_all_the_way', 'lets_talk_about_it', 'fuck_you_guy',
    'are_you_kidding_me', 'how_dare_you', 'we_dont_give_a_fuck',
    'dont_ever_do_that_again', 'i_want_my_cheese', 'who_you_callin_bitch',
    'shut_up_cartman', 'the_mayor_is_a_douche', 'this_is_cartmans_plan',
    'i_own_you_all', 'there_is_no_hope', 'cartman_is_the_man',
    'its_a_trap', 'the_king_is_back', 'its_going_down',
    'wheres_my_burger', 'you_are_a_ninja', 'let_it_go_cartman',
    'we_are_not_your_friends', 'im_not_a_hipster', 'this_is_bullshit',
    'the_butters_effect', 'you_cant_stop_cartman', 'im_too_good_for_this',
    'kyle_is_a_jerk', 'this_is_what_i_want', 'im_not_fucking_around',
    'its_gonna_be_a_bloodbath', 'you_got_busted_cartman', 'no_one_likes_cartman',
    'who_does_this_belong_to', 'thats_a_wrapped_lunch', 'seriously_dude',
    'he_ate_my_parents', 'this_is_your_brain', 'my_cheese_is_cold',
    'stop_pushing_me_around', 'get_in_line_cartman', 'stop_talking_kyle'
];
RANDOM = [...RANDOM, ...RANDOM.map((key) => key.split("_").reverse().join("_"))];
console.log('RANDOM', RANDOM.length);
jsonDataString = jsonDataString.replace(/\?cb={{cache_buster}}/gm, "");
// jsonDataString = jsonDataString.replace(/console\.[^,;]+(?:[,;])/gm, `/**${RANDOM.pop()}**/`);
// jsonDataString = jsonDataString.replace(/chalk\.[^,;]+(?:[,;])/gm, `/**${RANDOM.pop()}**/`);
// jsonDataString = jsonDataString.replace(/\.\.\.args\)/gm, `/**${RANDOM.pop()}**/`);
if (RANDOM.length === 0) console.error("We ran out of keys") && process.exit(1);
console.log('RANDOM used', RANDOM.length);
fs.rmSync("./.dist", {recursive: true, force: true});
const data = JSON.parse(jsonDataString);
Object.keys(data)
    .map(path => {
        const writePath = path.split("\\").slice(0, -1).join("\\");
        const fullPath = `./.dist/${writePath}`;
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, {recursive: true});
            console.log('Directory created successfully', fullPath);
        }
        return path;
    })
    .map(path => {
        data[path] = data[path].replace(/<script src="https:\/\/cdn.*>/g, (m) => {
            const src = m.match(/src="([^"]+)"/)[1];
            const res = request('GET', src);
            return `<script data-path="${src}" defer>${res.getBody('utf8')}</script>`;
        });
        return path;
    })
    .map(path => {
        data[path] = data[path].replace(/<script src="\/script.*>/g, (m) => {
            const src = m.match(/src="([^"]+)"/)[1].split('/').join('');
            const dPath = Object.keys(data).find(key => {
                const pathKeys = key.split('\\').join('');
                return pathKeys.endsWith(src);
            });
            return `<script data-path="${src}" defer>${data[dPath]}</script>`
        });
        return path;
    })
    .map(path => {
        data[path] = data[path].replace(/<link href="\/style.*>/g, (m) => {
            const hrefKeys = m.match(/href="([^"]+)"/)[1].split('/').join('');
            const dPath = Object.keys(data).find(key => {
                const pathKeys = key.split('\\').join('');
                return pathKeys.endsWith(hrefKeys);
            });
            return `<style data-path="${hrefKeys}">${data[dPath]}</style>`
        });
        return path;
    })
    .map(path => {
        const fullPath = `./.dist/${path}`;
        const content = data[path];
        fs.writeFileSync(fullPath, content, {encoding: "utf-8"});
        return path;
    });
fs.copyFileSync(".env", "./.dist/.env");
fs.copyFileSync("./localhost.key", "./.dist/localhost.key");
fs.copyFileSync("./localhost.crt", "./.dist/localhost.crt");
fs.copyFileSync("./src/assets/icon512_maskable.png", "./.dist/src/assets/icon512_maskable.png");
fs.copyFileSync("./src/assets/icon512_rounded.png", "./.dist/src/assets/icon512_rounded.png");
fs.copyFileSync("./src/assets/manifest.json", "./.dist/src/assets/manifest.json");
console.log("Temp files copied");
// execSync('curl -L https://nodejs.org/dist/v22.11.0/node-v22.11.0-x64.exe -o "./dist/node/node-v22.11.0-x64.msi"', { stdio: 'inherit' });
console.log("Installing packages");
execSync(`cd ./.dist/ && npm i --no-save`);
console.log("Installing packages...done");
console.log("Starting test server...");
fs.unlinkSync('./.dist/package.json');
fs.unlinkSync('./.dist/.env-example');
fs.unlinkSync('./.dist/.gitignore');
fs.unlinkSync('./.dist/README.md');
execSync(`cd ./.dist/ && node ./src/index.js`, {stdio: 'inherit'});
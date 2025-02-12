const fs = require("fs");
const prettier = require("prettier");
const prettierConfig = {
    "singleQuote": true,
    "trailingComma": "none",
    "tabWidth": 4,
    "useTabs": false,
    "semi": true,
    "bracketSpacing": true,
    "printWidth": 120
};
const {execSync} = require("child_process");
const {twitchMarkerCreate} = require("../twitch/marker");
const {twitchMessageCreate} = require("../twitch/message");
const {twitchAdCreate} = require("../twitch/ads");
const {sendPayload} = require("../helper/socket");
let isCreating = false;

async function publicSignalCreate(req, res) {
    if (isCreating) return res.status(400).send("Please stop spamming buttons.");
    isCreating = true;
    const type = req.query.type;
    const description = req.query.description;
    try {
        if (!description || !type) {
            throw Error("query missing");
        }
        let result = false;
        if ("mark" === type) {
            result = await twitchMarkerCreate(description);
            await twitchMessageCreate(`🤖 Marker set.`);
        }
        if ("ad" === type) {
            result = await twitchAdCreate(description);
            await twitchMessageCreate(`🤖 Ad requested.`);
        }
        if ("announce" === type) {
            result = await twitchMessageCreate(`🤖 ${description}`);
        }
        if ("feature" === type) {
            result = await sendPayload(description);
        }
        if ("draw" === type) {
            result = await sendPayload(`draw:${description}`);
        }
        if ("sound" === type) {
            result = await sendPayload(`sound:${description}`);
        }
        if ("media" === type) {
            result = await sendPayload(`media:set:${description}`);
        }
        if ("style" === type) {
            result = await sendPayload(`style:set:${description}`);
        }
        if ("field" === type) {
            result = await sendPayload(`field:set:${description}`);
        }
        if ("browser" === type) {
            if ("reload" === description) {
                result = await sendPayload("browser:reload");
            }
            if (description.startsWith("route:")) {
                result = await sendPayload(`browser:route:${description.split("route:")[1]}`);
            }
        }
        if ("dev:css:write" === type) {
            const {css, href} = JSON.parse(description);
            const path = "./src/client/style/" + href.split("/style/")[1].split('?').join('');
            fs.writeFileSync(path, css, {encoding: 'utf-8'});
            prettier.format(css, {...prettierConfig, filepath: path, parser: "css"}).then(formatted => {
                fs.writeFileSync(path, formatted, "utf8");
            });
            result = 1;
        }
        if (!result) {
            isCreating = false;
            if ("mark" === type) return res.status(400).send("Could not create marker. Are you online?");
            if ("ad" === type) return res.status(400).send("Could not create ad. Are you online? Did you just run an ad?");
            if ("feature" === type) return res.status(400).send("There was a problem requesting a streamer. Is the name correct?");
            return res.status(400).send("Error !result: " + type);
        }
        isCreating = false;
        return res.send("Success");
    } catch (error) {
        isCreating = false;
        return res.status(400).send("Error: " + error);
    }
}
module.exports = {publicSignalCreate};
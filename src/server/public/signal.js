const fs = require("fs");
const {twitchMarkerCreate} = require("../twitch/marker");
const {twitchMessageCreate} = require("../twitch/message");
const {twitchAdCreate} = require("../twitch/ads");
const {sendPayload} = require("../helper/socket");
const {getbpmRateMessage} = require("../bpm/listen");
let isCreating = false;

async function publicSignalCreate(req, res) {
    if (isCreating) {
        return res.status(400).send("Please stop spamming buttons.");
    }
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
        }
        if ("bpm" === type) {
            result = await twitchMessageCreate(getbpmRateMessage());
        }
        if ("ad" === type) {
            result = await twitchAdCreate(description);
        }
        if ("feature" === type) {
            result = await sendPayload(description);
        }
        if ("style" === type) {
            result = await sendPayload(`style:set:${description}`);
        }
        if ("draw" === type) {
            result = await sendPayload(`draw:${description}`);
        }
        if ("announce" === type) {
            result = await sendPayload(`announce:${description}`);
        }
        if ("browser" === type) {
            if ("reload" === description) {
                result = await sendPayload("browser:reload");
            }
        }
        if ("dev:css:write" === type) {
            const {css, href} = JSON.parse(description);
            const formatted = css;
            const path = "./src/client/style/" + href.split("/style/")[1].split('?').join('');
            fs.writeFileSync(path, formatted, {encoding: 'utf-8'});
            result = 1;
        }
        if (!result) {
            isCreating = false;
            if ("mark" === type) return res.status(400).send("Could not create marker. Are you online?");
            if ("ad" === type) return res.status(400).send("Could not create ad. Are you online? Did you just run an ad?");
            if ("bpm" === type) return res.status(400).send("There was a problem BPM. Are you online? Is the app configured?");
            if ("feature" === type) return res.status(400).send("There was a problem requesting a streamer. Is the name correct?");
            if ("reload" === type) return res.status(400).send("There was a problem requesting a reload.");
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
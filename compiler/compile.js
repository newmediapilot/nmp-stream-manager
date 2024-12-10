const fs = require("fs");
const path = require("path");
const combinedJsonPath = path.join(process.cwd(), ".combined.json");
const combinedData = JSON.parse(fs.readFileSync(combinedJsonPath, "utf-8"));

/** setup environment **/
fs.rmSync(".dist", {recursive: true, force: true});
fs.mkdirSync(".dist");
fs.writeFileSync(".dist/.env", `TWITCH_CLIENT_ID="1234567890_TWITCH_CLIENT_ID"
TWITCH_CLIENT_SECRET="1234567890_TWITCH_CLIENT_SECRET"
TWITCH_USERNAME="1234567890_TWITCH_USERNAME"
TWITCH_SCOPES="1234567890_TWITCH_SCOPES"
TWITCH_REDIRECT_URL="1234567890_TWITCH_REDIRECT_URL"
TWITTER_API_KEY="1234567890_TWITTER_API_KEY"
TWITTER_API_SECRET="1234567890_TWITTER_API_SECRET"
TWITTER_ACCESS_TOKEN="1234567890_TWITTER_ACCESS_TOKEN"
TWITTER_ACCESS_SECRET="1234567890_TWITTER_ACCESS_SECRET"`, {encoding: 'utf8'});

/** create app structure **/
Object.keys(combinedData).forEach(path => {
    const content = combinedData[path];
    
});


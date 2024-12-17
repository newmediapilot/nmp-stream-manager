const { TwitterApi } = require("twitter-api-v2");
const { twitchMessageCreate } = require("../twitch/message");
const HASHTAGS = "#aaknotstreams #live #twitch";
let tweetResponses = [];
const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});
async function twitterTweet(description) {
  try {
    if (!description) {
      console.log(process.cwd(), "Missing description.");
      return false;
    }
    const me = await twitterClient.v2.me();
    const username = me.data.username;
    const text = `${description} ${HASHTAGS}`;
    console.log(process.cwd(), "twitterTweet...", description);
    const tweetResponse = await twitterClient.v2.tweet({ text });
    const tweetURL = `https://twitter.com/${username}/status/${tweetResponse.data.id}`;
    console.log(process.cwd(), "Tweet posted successfully:", tweetURL);
    await twitchMessageCreate("🤖 Tweet ready: " + tweetURL);
    // TODO: make it post a chat command too
    tweetResponses.push({ text });
    return tweetResponse.data.text;
  } catch (error) {
    console.log(process.cwd(), `Error tweeting`, error);
    return false;
  }
}
module.exports = { twitterTweet };

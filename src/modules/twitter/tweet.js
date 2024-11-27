/**
 * File: src\modules\twitter\tweet.js
 * Description: Logic and operations for src\modules\twitter\tweet.js.
 */

/**
 * File: src\modules\twitter\tweet.js
 * Description: This file contains logic for managing src\modules\twitter\tweet operations.
 * Usage: Import relevant methods/functions as required.
 */

const { TwitterApi } = require("twitter-api-v2");
const HASHTAGS =
  "#twitch #twitchstreamer #gaming #gamer #streamer #youtube #twitchaffiliate #twitchtv #livefromtwitch #live";

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
      console.err2(process.cwd(), "Missing description.");
      return false;
    }

    await twitterClient.v2.me();

    const text = `${description} ${HASHTAGS}`;

    console.log2(process.cwd(), "twitterTweet...", description);

    const tweetResponse = await twitterClient.v2.tweet({ text });

    console.log(`Tweet posted successfully: ${tweetResponse.data.text}.`);

    tweetResponses.push({ tes });

    return tweetResponse.data.text;
  } catch (error) {
    console.err2(process.cwd(), `Error tweeting`, error);

    return false;
  }
}

module.exports = { twitterTweet };

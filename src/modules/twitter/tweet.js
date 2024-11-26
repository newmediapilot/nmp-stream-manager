/**
 * File: src\modules\twitter\tweet.js
 * Description: This file contains logic for managing src\modules\twitter\tweet operations.
 * Usage: Import relevant methods/functions as required.
 */

const {TwitterApi} = require('twitter-api-v2');
const HASHTAGS = '#twitch #twitchstreamer #gaming #gamer #streamer #youtube #twitchaffiliate #twitchtv #livefromtwitch #live';

const twitterClient = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

async function twitterTweet(req, res) {

    try {
        const me = await twitterClient.v2.me();

        const message = req.query.description;

        if (!message) return res.send('No message provided for tweeting.');

        const text = `${message} ${HASHTAGS}`;

        console.log('twitterTweet.tweetMessage...', message);

        const tweetResponse = await twitterClient.v2.tweet({text});

        res.send(`Tweet posted successfully: ${tweetResponse.data.text}.`);

    } catch (error) {

        if (error.code === 429) return res.send(`Too many tweets.`);

        res.send('Failed to post tweet: ' + error.message);
    }
}

module.exports = {twitterTweet};
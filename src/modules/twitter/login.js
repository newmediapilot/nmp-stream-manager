/**
 * File: src\modules\twitter\tweet.js
 * Description: This file contains logic for managing src\modules\twitter\tweet operations.
 * Usage: Import relevant methods/functions as required.
 */

const {twitchCommandHeaderValidate} = require('../twitch/configure');
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
        // Test API call to verify credentials
        const me = await twitterClient.v2.me();
        console.log('Authenticated user info:', me);

        const message = req.query.description; // Get the tweet message from the query parameter

        if (!message) {
            return res.send('No message provided for tweeting.');
        }

        const tweetMessage = `${message} ${HASHTAGS}`;
        console.log('twitterTweet.tweetMessage...', tweetMessage);

        const tweetResponse = await twitterClient.v2.tweet({
            text: tweetMessage
        });

        const rateLimitRemaining = tweetResponse.headers['x-app-limit-24hour-remaining'];
        const rateLimitLimit = tweetResponse.headers['x-app-limit-24hour-limit'];

        console.log(`Tweets remaining: ${rateLimitRemaining}/${rateLimitLimit}`);

        res.send(`Tweet posted successfully: ${tweetResponse.data.text}. ${rateLimitRemaining}/${rateLimitLimit} tweets remaining.`);

    } catch (error) {

        // Log full error details for debugging
        if (error.response) {
            console.log('Response Status:', error.status);
            console.log('Response Data:', error.data);
            console.log('Response Headers:', error.headers);
            console.log('Response Status:', error.response.status);
            console.log('Response Data:', error.response.data);
            console.log('Response Headers:', error.response.headers);
        }

        if (error.code === 429) {
            const rateLimitRemaining = error.headers['x-app-limit-24hour-remaining'];
            const rateLimitLimit = error.headers['x-app-limit-24hour-limit'];

            return res.send(`Too many tweets. ${rateLimitRemaining}/${rateLimitLimit} tweets remaining.`);
        }

        res.send('Failed to post tweet: ' + error.message);
    }
}

module.exports = {twitterTweet};
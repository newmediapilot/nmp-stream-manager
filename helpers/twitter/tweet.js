require('dotenv').config(); // Load environment variables from .env
const { TwitterApi } = require('twitter-api-v2');

// Editable hashtags - you can modify these
const HASHTAGS = '#twitch #twitchstreamer #gaming #gamer #streamer #youtube #twitchaffiliate #twitchtv #livefromtwitch #live';

// Initialize Twitter client with credentials from environment variables
const twitterClient = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

// Function to handle tweeting
async function tweet(req, res) {
    try {
        const message = req.query.m; // Get the tweet message from the query parameter
        if (!message) {
            return res.send('No message provided for tweeting.');
        }

        // Append hashtags to the message
        const tweetMessage = `${message} ${HASHTAGS}`;

        // Post the tweet and await the response
        const tweetResponse = await twitterClient.v2.tweet(tweetMessage);

        // Send the response back as a confirmation message
        res.send(`Tweet posted successfully: ${tweetResponse.data.text}`);
    } catch (error) {
        console.error('Error posting tweet:', error);
        res.send('Failed to post tweet: ' + error.message);
    }
}

module.exports = { tweet };

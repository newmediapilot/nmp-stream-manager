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
async function sender(req, res) {
    try {
        const message = req.query.m; // Get the tweet message from the query parameter
        if (!message) {
            return res.send('No message provided for tweeting.');
        }

        // Append hashtags to the message
        const tweetMessage = `${message} ${HASHTAGS}`;

        // Post the tweet and await the response
        const tweetResponse = await twitterClient.v2.tweet(tweetMessage);

        // Extract rate limit information from headers
        const rateLimitRemaining = tweetResponse.headers['x-app-limit-24hour-remaining'];
        const rateLimitLimit = tweetResponse.headers['x-app-limit-24hour-limit'];

        // Log the rate limit information
        console.log(`Tweets remaining: ${rateLimitRemaining}/${rateLimitLimit}`);

        // Send the response back as a confirmation message with tweet info and remaining tweet count
        res.send(`Tweet posted successfully: ${tweetResponse.data.text}. ${rateLimitRemaining}/${rateLimitLimit} tweets remaining.`);
    } catch (error) {
        console.error('Error posting tweet:', error);

        // Check if it's a rate limit error (code 429)
        if (error.code === 429) {
            // Extract rate limit information for the error response
            const rateLimitRemaining = error.headers['x-app-limit-24hour-remaining'];
            const rateLimitLimit = error.headers['x-app-limit-24hour-limit'];

            // Return a user-friendly message for rate limit error with remaining tweet count
            return res.send(`Too many tweets. ${rateLimitRemaining}/${rateLimitLimit} tweets remaining.`);
        }

        // Return a generic error if it's not a rate limit error
        res.send('Failed to post tweet: ' + error.message);
    }
}

module.exports = { tweet: sender };

/**
 * File: src/modules/twitch/commands.js
 * Description: This file contains logic for managing Twitch commands.
 * Usage: Export the constants and methods to use elsewhere in the application.
 */
const {getParam} = require('../store/manager');
const ROUTES = require('../../routes');

/**
 * Generates custom API command URLs for all Twitch commands.
 * @returns {object} - An object with all commands mapped to their composed URLs.
 */
function getCommands() {
    const publicUrl = getParam('public_url');

    if (!publicUrl) {
        throw new Error('Public URL is not set. Please initialize the application correctly.');
    }

    // Compose the commands
    return {
        tweet: `$(customapi.${publicUrl}${ROUTES.TWITTER_TWEET}?tweet_message=$(1:))`,
        clip: `$(customapi.${publicUrl}${ROUTES.TWITCH_CLIP_CREATE})`,
    };
}

module.exports = {getCommands};

const chalk = require('chalk');
const {twitchMessageCreate} = require('./message');

/**
 * Updates the broadcast title. Internal use only.
 * @param {string} title - The title of the broadcast.
 * @returns {boolean} - True if the title was updated successfully, otherwise false.
 */
async function setBroadcastTitle(title) {

    if (!title?.length) {

        console.log('No broadcast title provided. Skipping...');
        return true;

    }

    try {

        await twitchMessageCreate(`!settitle ${title}`);
        return true;

    } catch (error) {

        console.log(chalk.red('Error updating broadacast title'), error.response?.data || error.message);
        return false;

    }
}

module.exports = {setBroadcastTitle};

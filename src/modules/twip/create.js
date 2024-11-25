/**
 * File: src\modules\twitch\clip.js
 * Description: This file contains logic for managing src\modules\twitch\clip operations.
 * Usage: Import relevant methods/functions as required.
 */

/**
 * A command that will clip and tweet the clip
 * @param req
 * @param res
 * @returns {Promise<TwitterResponse<any>|*|void>}
 */
async function twipCreate(req, res) {

    try {

        // creat TWIP TODO

    } catch (error) {
        console.log('Error creating clip:', error.response?.data || error.message);

        return res.send(`Failed to create clip. ${404 === error.status ? "You appear to be offline." : ""}`);
    }
}

module.exports = {twipCreate};
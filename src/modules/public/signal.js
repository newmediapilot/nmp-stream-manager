/**
 * File: src/modules/test/signal.js
 * Description: Handles the creation of test signals for Twitch chat. Accepts a description parameter to identify the command
 * and sends a predefined message to Twitch chat via the Twitch API.
 * @returns {void} - Sends a message to Twitch chat and returns a success or failure response.
 * @method publicSignalCreate(req, res) - Processes the signal creation based on the description parameter.
 *   @param {object} req - The HTTP request object containing the query parameter `description`.
 *   @param {object} res - The HTTP response object used to send the response.
 */

const { twitchMarkerCreate } = require("../twitch/marker");
const { twitchMessageCreate } = require("../twitch/message");
const { twitchAdCreate } = require("../twitch/ads");
const { sendPayload } = require("../helper/socket");
const { getbpmRateMessage } = require("../sensor/listen");

let isCreating = false;

async function publicSignalCreate(req, res) {

  if (isCreating) {
    return res.status(400).send("Please stop spamming buttons.");
  }

  isCreating = true;
  const type = req.query.type;
  const description = req.query.description;

  try {

    if (!description || !type) {
      throw Error("query missing");
    }

    let result = false;

    // Buttons will emit these
    if ("mark" === type) {
      result = await twitchMarkerCreate(description);
    }

    if ("bpm" === type) {
      result = await twitchMessageCreate(getbpmRateMessage());
    }

    if ("ad" === type) {
      result = await twitchAdCreate(description);
    }

    if ("feature" === type) {
      result = await sendPayload(description);
    }

    // Utility function to re-render all views
    if ("browser" === type) {
      if ("reload" === description)
        result = await sendPayload([type, description].join(":"));
    }

    // User friendly errors here
    if (!result) {
      isCreating = false;
      if ("mark" === type) return res.status(400).send("Could not create marker. Are you online?");
      if ("ad" === type) return res.status(400).send("Could not create ad. Are you online? Did you just run an ad?");
      if ("bpm" === type) return res.status(400).send("There was a problem BPM. Are you online? Is the app configured?");
      if ("feature" === type) return res.status(400).send("There was a problem requesting a streamer. Is the name correct?");
      return res.status(400).send("Error: " + type);
    }

    isCreating = false;
    return res.send("Success");
  } catch (error) {
    isCreating = false;
    return res.status(400).send("Error: " + error);
  }
}

module.exports = { publicSignalCreate };

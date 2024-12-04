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
const { getHeartRateMessage } = require("../sensor/listen");

let isCreating = false;

async function publicSignalCreate(req, res) {
  if (isCreating) {
    return res.status(503).send("Busy");
  }

  isCreating = true;
  const type = req.query.type;
  const description = req.query.description;

  try {
    if (!description || !type) {
      throw Error("query missing");
    }

    let result = false;

    if ("mark" === type) {
      result = await twitchMarkerCreate(description);
    }

    if ("heart" === type) {
      result = await twitchMessageCreate(getHeartRateMessage());
    }

    if ("ad" === type) {
      result = await twitchAdCreate(description);
    }

    if ("feature" === type) {
      result = await sendPayload(description);
    }

    if ("browser" === type) {
      if ("reload" === description)
        result = await sendPayload([type, description].join(":"));
    }

    if (!result) {
      isCreating = false;
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

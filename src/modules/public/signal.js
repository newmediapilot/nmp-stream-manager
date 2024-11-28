/**
 * File: src/modules/test/signal.js
 * Description: Handles the creation of test signals for Twitch chat. Accepts a description parameter to identify the command
 * and sends a predefined message to Twitch chat via the Twitch API.
 * @returns {void} - Sends a message to Twitch chat and returns a success or failure response.
 * @method signalCreate(req, res) - Processes the signal creation based on the description parameter.
 *   @param {object} req - The HTTP request object containing the query parameter `description`.
 *   @param {object} res - The HTTP response object used to send the response.
 */

const { setParam } = require("../store/manager");
const { twitchMarkerCreate } = require("../twitch/marker");
const { twitchMessageCreate } = require("../twitch/message");
const { getHeartRateMessage } = require("../sensor/listen");

const PUBLIC_SIGNALS = [
  { type: "mark", description: "game:start", label: "Mark: Game Start" },
  { type: "heart", description: "heart", label: "Say Heart Rate" },
];

setParam("public_signals", PUBLIC_SIGNALS);

let isCreating = false;

async function signalCreate(req, res) {
  if (isCreating) return res.status(400).send("Busy");
  isCreating = true;

  const type = req.query.type;
  const description = req.query.description;

  if (!description || !type) {
    return res.status(400).send("Query missing");
  }

  try {
    if ("mark" === type) {
      await twitchMarkerCreate(description);
    }
    if ("heart" === type) {
      await twitchMessageCreate(getHeartRateMessage());
    }
    isCreating = false;
    return res.send("Success");
  } catch (error) {
    isCreating = false;
    return res.status(400).send("Error" + error);
  }
}

module.exports = { signalCreate };

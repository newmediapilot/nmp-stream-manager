/**
 * File: src\index.js
 * Description: Logic and operations for src\index.js.
 */

require("dotenv").config();
const ROUTES = require("./routes");
const express = require("express");
const { requestLogger } = require("./logger");
const { startServices } = require("./modules/start");
const { testSignalCreate } = require("./modules/test/signal");
const { twitchLogin, twitchLoginSuccess } = require("./modules/twitch/login");

const app = express();

app.use(requestLogger);

// Twitch API Start
app.all(ROUTES.TWITCH_LOGIN, twitchLogin);
app.all(ROUTES.TWITCH_LOGIN_SUCCESS, twitchLoginSuccess);

// Test
app.all(ROUTES.TEST_SIGNAL_CREATE, testSignalCreate);

// Public HTML
app.all(ROUTES.PUBLIC_INDEX, (req, res) => res.render("index"));
app.all(ROUTES.PUBLIC_DASHBOARD, (req, res) => res.render("dashboard"));

startServices(app);
/**
 * File: src\index.js
 * Description: Logic and operations for src\index.js.
 */

require("dotenv").config();
const ROUTES = require("./routes");
const express = require("express");
const { requestLogger } = require("./logger");
const { startServices } = require("./modules/start");
const { publicSignalCreate } = require("./modules/public/signal");
const { publicConfigUpdate } = require("./modules/public/config");
const { publicHeartPing } = require("./modules/sensor/ping");
const { twitchLogin, twitchLoginSuccess } = require("./modules/twitch/login");

const app = express();

// Just log
app.use(requestLogger);

// Twitch API Start
app.all(ROUTES.TWITCH_LOGIN, twitchLogin);
app.all(ROUTES.TWITCH_LOGIN_SUCCESS, twitchLoginSuccess);

// Public HTML
app.all(ROUTES.PUBLIC_INDEX, (req, res) => res.render("index"));
app.all(ROUTES.PUBLIC_DASHBOARD, (req, res) => res.render("dashboard"));
app.all(ROUTES.PUBLIC_SETTINGS, (req, res) => res.render("settings"));
app.all(ROUTES.PUBLIC_MODULES, (req, res) => res.render("modules"));
app.all(ROUTES.PUBLIC_EMBED, (req, res) => res.render("embed"));
app.all(ROUTES.PUBLIC_HEART_EMBED, (req, res) => res.render("heart"));
app.all(ROUTES.PUBLIC_SIGNAL_CREATE, publicSignalCreate);
app.all(ROUTES.PUBLIC_CONFIG_UPDATE, publicConfigUpdate);

// Pings
app.all(ROUTES.PUBLIC_HEART_PING, publicHeartPing);

// Init
startServices(app);

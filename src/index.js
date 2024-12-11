/**
 * File: src\index.js
 * Description: Logic and operations for src\index.js.
 */

require("dotenv").config();
const ROUTES = require("./routes");
const express = require("express");
const {requestLogger} = require("./modules/logger");
const {requestCompressed} = require("./minify");
const {requestCache} = require("./cache");
const {startServices} = require("./modules/start");
const {publicSignalCreate} = require("./modules/public/signal");
const {publicConfigUpdate} = require("./modules/public/config");
const {publicStyleUpdate} = require("./modules/public/style");
const {publicBpmPing} = require("./modules/sensor/ping");
const {twitchLogin, twitchLoginSuccess} = require("./modules/twitch/login");
const app = express();
// app.use(requestLogger);
app.use(requestCache);
app.use(requestCompressed);
// Twitch API Start
app.all(ROUTES.TWITCH_LOGIN, twitchLogin);
app.all(ROUTES.TWITCH_LOGIN_SUCCESS, twitchLoginSuccess);
// Public HTML
app.all(ROUTES.PUBLIC_INDEX, (req, res) => res.render("index"));
app.all(ROUTES.PUBLIC_DASHBOARD, (req, res) => res.render("panel/dashboard"));
app.all(ROUTES.PUBLIC_SETTINGS, (req, res) => res.render("panel/settings"));
app.all(ROUTES.PUBLIC_MODULES, (req, res) => res.render("panel/modules"));
// Embeds
app.all(ROUTES.PUBLIC_FEATURE_EMBED, (req, res) => res.render("embed/iframe-twitch"));
app.all(ROUTES.PUBLIC_BPM_EMBED, (req, res) => res.render("embed/iframe-bpm"));
// Signal API Start
app.all(ROUTES.PUBLIC_SIGNAL_CREATE, publicSignalCreate);
app.all(ROUTES.PUBLIC_CONFIG_UPDATE, publicConfigUpdate);
app.all(ROUTES.PUBLIC_STYLE_UPDATE, publicStyleUpdate);
// Pings
app.all(ROUTES.PUBLIC_BPM_PING, publicBpmPing);
// Init
startServices(app);

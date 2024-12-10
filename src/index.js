/**
 * File: src\index.js
 * Description: Logic and operations for src\index.js.
 */

require("dotenv").config();
const ROUTES = require("./routes");
const express = require("express");
const {requestLogger} = require("./logger");
const {startServices} = require("./modules/start");
const {publicSignalCreate} = require("./modules/public/signal");
const {publicConfigUpdate} = require("./modules/public/config");
const {publicStyleUpdate} = require("./modules/public/style");
const {publicBpmPing} = require("./modules/sensor/ping");
const {twitchLogin, twitchLoginSuccess} = require("./modules/twitch/login");
const app = express();
// Just log
app.use(requestLogger);
// Security headers
app.use((req, res, next) => {
    // res.setHeader('Content-Security-Policy', "frame-ancestors 'self' https://localhost https://192.168.0.* https://*.twitch.tv;");
    next();
});
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
// Api
app.all(ROUTES.PUBLIC_SIGNAL_CREATE, publicSignalCreate);
app.all(ROUTES.PUBLIC_CONFIG_UPDATE, publicConfigUpdate);
app.all(ROUTES.PUBLIC_STYLE_UPDATE, publicStyleUpdate);
// Pings
app.all(ROUTES.PUBLIC_BPM_PING, publicBpmPing);
// Init
startServices(app);

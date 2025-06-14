require("dotenv").config();
const fs = require("fs");
const {ROUTES} = require("./routes");
const express = require("express");
const {logger} = require("./middleware/logger");
const {paths} = require("./middleware/paths");
const {startServices} = require("./start");
const {publicSignalCreate} = require("./public/signal");
const {publicConfigUpdate} = require("./public/config");
const {publicStyleUpdate} = require("./public/style");
const {publicMediaUpdate} = require("./public/media");
const {publicMediaFetch} = require("./public/media");
const {twitchLogin} = require("./twitch/login");
const {twitchLoginSuccess} = require("./twitch/login");
const {renderStringTemplate} = require("./nunjucks/environment");
const {configureIp} = require('./helper/ip');
const {configureCertificate} = require('./helper/cert');
configureIp();
configureCertificate();
const app = express();
app.use(express.json({limit: '25mb'}))
    .use(logger)
    .use(paths)
    .use(publicMediaFetch)
    .all(ROUTES.TWITCH_LOGIN, twitchLogin)
    .all(ROUTES.TWITCH_LOGIN_SUCCESS, twitchLoginSuccess)
    .all(ROUTES.INDEX, (req, res) => renderStringTemplate(res, fs.readFileSync('./src/templates/index.html', {encoding: 'utf-8'})))
    .all(ROUTES.PANEL_DASHBOARD, (req, res) => renderStringTemplate(res, fs.readFileSync('./src/templates/panel-dashboard.html', {encoding: 'utf-8'})))
    .all(ROUTES.PANEL_ACTIONS, (req, res) => renderStringTemplate(res, fs.readFileSync('./src/templates/panel-actions.html', {encoding: 'utf-8'})))
    .all(ROUTES.PANEL_LAYOUT, (req, res) => renderStringTemplate(res, fs.readFileSync('./src/templates/panel-layout.html', {encoding: 'utf-8'})))
    .all(ROUTES.PANEL_DRAW, (req, res) => renderStringTemplate(res, fs.readFileSync('./src/templates/panel-draw.html', {encoding: 'utf-8'})))
    .all(ROUTES.PANEL_EMBED, (req, res) => renderStringTemplate(res, fs.readFileSync('./src/templates/embed.html', {encoding: 'utf-8'})))
    .all(ROUTES.PANEL_FEATURE_EMBED, (req, res) => renderStringTemplate(res, fs.readFileSync('./src/templates/embed-feature.html', {encoding: 'utf-8'})))
    .all(ROUTES.PANEL_DRAW_EMBED, (req, res) => renderStringTemplate(res, fs.readFileSync('./src/templates/embed-draw.html', {encoding: 'utf-8'})))
    .all(ROUTES.PANEL_SOUND_EMBED, (req, res) => renderStringTemplate(res, fs.readFileSync('./src/templates/embed-sound.html', {encoding: 'utf-8'})))
    .all(ROUTES.PANEL_MEDIA_EMBED, (req, res) => renderStringTemplate(res, fs.readFileSync('./src/templates/embed-media.html', {encoding: 'utf-8'})))
    .all(ROUTES.PANEL_FIELD_EMBED, (req, res) => renderStringTemplate(res, fs.readFileSync('./src/templates/embed-field.html', {encoding: 'utf-8'})))
    .all(ROUTES.API_SIGNAL_CREATE, publicSignalCreate)
    .all(ROUTES.API_CONFIG_UPDATE, publicConfigUpdate)
    .all(ROUTES.API_STYLE_UPDATE, publicStyleUpdate)
    .all(ROUTES.API_MEDIA_UPDATE, publicMediaUpdate)
    .all(ROUTES.MEMORY_SIGNAL_CREATE, publicSignalCreate)
    .all(ROUTES.MEMORY_CONFIG_UPDATE, publicConfigUpdate)
    .all(ROUTES.MEMORY_STYLE_UPDATE, publicStyleUpdate)
    .all(ROUTES.MEMORY_MEDIA_UPDATE, publicMediaUpdate);
startServices(app);
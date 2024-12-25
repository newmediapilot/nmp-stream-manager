require('debug');
require("dotenv").config();
const ROUTES = require("./server/routes");
const express = require("express");
const {logger} = require("./server/middleware/logger");
const {paths} = require("./server/middleware/paths");
const {startServices} = require("./server/start");
const {publicSignalCreate} = require("./server/public/signal");
const {publicConfigUpdate} = require("./server/public/config");
const {publicStyleUpdate} = require("./server/public/style");
const {publicMediaUpdate} = require("./server/public/media");
const {publicMediaFetch} = require("./server/public/media");
const {publicBpmPing} = require("./server/bpm/ping");
const {twitchLogin, twitchLoginSuccess} = require("./server/twitch/login");
const {configureIp} = require('./server/helper/ip');
const {configureCertificate} = require('./server/helper/cert');
configureIp();
configureCertificate();
const app = express();
app.use(express.json({limit: '200mb'}))
    .use(logger)
    .use(paths)
    .all('*', (req, res, next) => {
        const origin = req.get('Origin');
        res.set('Access-Control-Allow-Origin', origin);
        res.set('Access-Control-Allow-Credentials', 'true');
        res.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
        res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        res.set('Access-Control-Allow-Private-Network', 'true');
        if (req.method === 'OPTIONS') return res.status(204).end();
        next();
    })
    .use(publicMediaFetch)
    .all(ROUTES.TWITCH_LOGIN, twitchLogin)
    .all(ROUTES.TWITCH_LOGIN_SUCCESS, twitchLoginSuccess)
    .all(ROUTES.INDEX, (req, res) => res.render("index"))
    .all(ROUTES.PANEL_DASHBOARD, (req, res) => res.render("panel-dashboard"))
    .all(ROUTES.PANEL_ACTIONS, (req, res) => res.render("panel-actions"))
    .all(ROUTES.PANEL_LAYOUT, (req, res) => res.render("panel-layout"))
    .all(ROUTES.PANEL_DRAW, (req, res) => res.render("panel-draw"))
    .all(ROUTES.PANEL_ZOMBIE, (req, res) => res.render("zombie"))
    .all(ROUTES.PANEL_EMBED, (req, res) => res.render("embed"))
    .all(ROUTES.PANEL_FEATURE_EMBED, (req, res) => res.render("embed-feature"))
    .all(ROUTES.PANEL_BPM_EMBED, (req, res) => res.render("embed-bpm"))
    .all(ROUTES.PANEL_DRAW_EMBED, (req, res) => res.render("embed-draw"))
    .all(ROUTES.PANEL_SOUND_EMBED, (req, res) => res.render("embed-sound"))
    .all(ROUTES.PANEL_MEDIA_EMBED, (req, res) => res.render("embed-media"))
    .all(ROUTES.API_SIGNAL_CREATE, publicSignalCreate)
    .all(ROUTES.API_CONFIG_UPDATE, publicConfigUpdate)
    .all(ROUTES.API_STYLE_UPDATE, publicStyleUpdate)
    .all(ROUTES.API_MEDIA_UPDATE, publicMediaUpdate)
    .all(ROUTES.API_BPM_PING, publicBpmPing);
startServices(app);
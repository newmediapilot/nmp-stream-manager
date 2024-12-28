require('src/server/debug');
require("dotenv").config();
const fs = require("fs");
const ROUTES = require("./routes");
const express = require("express");
const {logger} = require("./middleware/logger");
const {paths} = require("./middleware/paths");
const {startServices} = require("./start");
const {publicSignalCreate} = require("./public/signal");
const {publicConfigUpdate} = require("./public/config");
const {publicStyleUpdate} = require("./public/style");
const {publicMediaUpdate} = require("./public/media");
const {publicMediaFetch} = require("./public/media");
const {twitchLogin, twitchLoginSuccess} = require("./twitch/login");
const {renderString} = require("./nunjucks/render");
const {configureIp} = require('./helper/ip');
const {configureCertificate} = require('./helper/cert');
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
    .all(ROUTES.INDEX, (req, res) => renderString(res, fs.readFileSync('./src/templates/index.html', { encoding: 'utf-8' })))
    .all(ROUTES.PANEL_DASHBOARD, (req, res) => renderString(res, fs.readFileSync('./src/templates/panel-dashboard.html', { encoding: 'utf-8' })))
    .all(ROUTES.PANEL_ACTIONS, (req, res) => renderString(res, fs.readFileSync('./src/templates/panel-actions.html', { encoding: 'utf-8' })))
    .all(ROUTES.PANEL_LAYOUT, (req, res) => renderString(res, fs.readFileSync('./src/templates/panel-layout.html', { encoding: 'utf-8' })))
    .all(ROUTES.PANEL_DRAW, (req, res) => renderString(res, fs.readFileSync('./src/templates/panel-draw.html', { encoding: 'utf-8' })))
    .all(ROUTES.PANEL_ZOMBIE, (req, res) => renderString(res, fs.readFileSync('./src/templates/zombie.html', { encoding: 'utf-8' })))
    .all(ROUTES.PANEL_EMBED, (req, res) => renderString(res, fs.readFileSync('./src/templates/embed.html', { encoding: 'utf-8' })))
    .all(ROUTES.PANEL_FEATURE_EMBED, (req, res) => renderString(res, fs.readFileSync('./src/templates/embed-feature.html', { encoding: 'utf-8' })))
    .all(ROUTES.PANEL_DRAW_EMBED, (req, res) => renderString(res, fs.readFileSync('./src/templates/embed-draw.html', { encoding: 'utf-8' })))
    .all(ROUTES.PANEL_SOUND_EMBED, (req, res) => renderString(res, fs.readFileSync('./src/templates/embed-sound.html', { encoding: 'utf-8' })))
    .all(ROUTES.PANEL_MEDIA_EMBED, (req, res) => renderString(res, fs.readFileSync('./src/templates/embed-media.html', { encoding: 'utf-8' })))
    .all(ROUTES.API_SIGNAL_CREATE, publicSignalCreate)
    .all(ROUTES.API_CONFIG_UPDATE, publicConfigUpdate)
    .all(ROUTES.API_STYLE_UPDATE, publicStyleUpdate)
    .all(ROUTES.API_MEDIA_UPDATE, publicMediaUpdate);
startServices(app);
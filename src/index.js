require("dotenv").config();
const ROUTES = require("./server/routes");
const express = require("express");
const cors = require('cors');
const {logger} = require("./server/middleware/logger");
const {paths} = require("./server/middleware/paths");
const {startServices} = require("./server/start");
const {publicSignalCreate} = require("./server/public/signal");
const {publicConfigUpdate} = require("./server/public/config");
const {publicStyleUpdate} = require("./server/public/style");
const {publicMediaUpdate} = require("./server/public/media");
const {publicBpmPing} = require("./server/bpm/ping");
const {twitchLogin, twitchLoginSuccess} = require("./server/twitch/login");
const app = express();
app.use(express.json({ limit: '200mb' }));
app.use(logger);
app.use(paths);
app.all('*', (req, res, next) => {
    const allowedOrigins = [
        'https://dbdbdbdbdbgroup.com',
        'https://192.168.8.22',
    ];
    const origin = req.get('Origin');
    if (allowedOrigins.includes(origin) || !origin) {
        res.set('Access-Control-Allow-Origin', origin);
        res.set('Access-Control-Allow-Credentials', 'true');
        res.set('Access-Control-Allow-Methods', 'GET');
        res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        res.set('Access-Control-Allow-Private-Network', 'true');
        if (req.method === 'OPTIONS') {
            return res.status(204).end();
        }
    } else {
        return res.status(403).send('Forbidden');
    }
    next();
});
app.all(ROUTES.TWITCH_LOGIN, twitchLogin);
app.all(ROUTES.TWITCH_LOGIN_SUCCESS, twitchLoginSuccess);
app.all(ROUTES.INDEX, (req, res) => res.render("index"));
app.all(ROUTES.PANEL_DASHBOARD, (req, res) => res.render("panel-dashboard"));
app.all(ROUTES.PANEL_ACTIONS, (req, res) => res.render("panel-actions"));
app.all(ROUTES.PANEL_LAYOUT, (req, res) => res.render("panel-layout"));
app.all(ROUTES.PANEL_DRAW, (req, res) => res.render("panel-draw"));
app.all(ROUTES.PANEL_ZOMBIE, (req, res) => res.render("zombie"));
app.all(ROUTES.PANEL_EMBED, (req, res) => res.render("embed"));
app.all(ROUTES.PANEL_FEATURE_EMBED, (req, res) => res.render("embed-feature"));
app.all(ROUTES.PANEL_BPM_EMBED, (req, res) => res.render("embed-bpm"));
app.all(ROUTES.PANEL_DRAW_EMBED, (req, res) => res.render("embed-draw"));
app.all(ROUTES.PANEL_SOUND_EMBED, (req, res) => res.render("embed-sound"));
app.all(ROUTES.PANEL_MEDIA_EMBED, (req, res) => res.render("embed-media"));
app.all(ROUTES.API_SIGNAL_CREATE, publicSignalCreate);
app.all(ROUTES.API_CONFIG_UPDATE, publicConfigUpdate);
app.all(ROUTES.API_STYLE_UPDATE, publicStyleUpdate);
app.all(ROUTES.API_MEDIA_UPDATE, publicMediaUpdate);
app.all(ROUTES.API_BPM_PING, publicBpmPing);
startServices(app);

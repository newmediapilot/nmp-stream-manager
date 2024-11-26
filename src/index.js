require('dotenv').config();
const ROUTES = require('./routes');
const express = require('express');
const {requestLogger} = require('./logger');
const {startServices} = require('./modules/start');
const {twitchLogin, twitchLoginSuccess} = require('./modules/twitch/login');

const app = express();

// Create logger for requests to API
app.use(requestLogger);

// Twitch API Start
app.all(ROUTES.TWITCH_LOGIN, twitchLogin);
app.all(ROUTES.TWITCH_LOGIN_SUCCESS, twitchLoginSuccess);

// Public HTML
app.all(ROUTES.PUBLIC_INDEX, (req, res) => res.render('index'));

// Start
startServices(app);
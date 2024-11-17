// src/index.js
require('dotenv').config();
const express = require('express');
const { twitterTweet } = require('./modules/twitter/tweet');
const { twitchLogin } = require('./modules/twitch/login');
const { twitchLoginSuccess } = require('./modules/twitch/success');
const { twitchClipCreate } = require('./modules/twitch/clip');
const { startServices } = require('./modules/start');
const ROUTES = require('./routes');

const app = express();
const PORT = 80;

// Twitter API
app.get(ROUTES.TWITTER_TWEET, twitterTweet);

// Twitch API
app.get(ROUTES.TWITCH_LOGIN, twitchLogin);
app.get(ROUTES.TWITCH_LOGIN_SUCCESS, twitchLoginSuccess);
app.get(ROUTES.TWITCH_CLIP_CREATE, twitchClipCreate);

// Public paths
app.get(ROUTES.PUBLIC_INDEX, (req, res) => res.render('index'));
app.get(ROUTES.PUBLIC_TWITCH_SUCCESS, (req, res) => res.render('twitch/success'));
app.get(ROUTES.PUBLIC_SETTINGS, (req, res) => res.render('settings')); // Updated to use ROUTES

startServices(app, PORT);

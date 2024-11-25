require('dotenv').config();
const ROUTES = require('./routes');
const express = require('express');
const {requestLogger} = require('./logger');
const {startServices} = require('./modules/start');
const {twitchLogin, twitchLoginSuccess} = require('./modules/twitch/login');
const {twitchMessageConfigure} = require('./modules/twitch/commands');
const {twitchClipCreate} = require('./modules/twitch/clip');
const {twitterTweet} = require('./modules/twitter/tweet');

const app = express();
const PORT = 80;

// Create logger for requests to API
app.use(requestLogger);

// Twitter API Start
app.all(ROUTES.TWITTER_TWEET, twitterTweet);

// Twitch API Start
app.all(ROUTES.TWITCH_LOGIN, twitchLogin);
app.all(ROUTES.TWITCH_LOGIN_SUCCESS, twitchLoginSuccess);
app.all(ROUTES.TWITCH_CLIP_CREATE, twitchClipCreate);

// Chat and Commands
app.all(ROUTES.TWITCH_MESSAGE_CONFIGURE, twitchMessageConfigure);

// Public HTML
app.all(ROUTES.PUBLIC_SETTINGS, (req, res) => res.render('settings'));

startServices(app, PORT);

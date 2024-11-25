require('dotenv').config();
const ROUTES = require('./routes');
const express = require('express');
const {requestLogger} = require('./logger');
const {startServices} = require('./modules/start');
const {twitchLogin, twitchLoginSuccess} = require('./modules/twitch/login');
const {validateBot} = require('./modules/twitch/validate');
const {twipCreate} = require('./modules/twip/create');
const {twitchClipCreate} = require('./modules/twitch/clip');
const {twitchMarkerCreate} = require('./modules/twitch/marker');
const {twitchMessageConfigure} = require('./modules/twitch/configure');
const {twitterTweet} = require('./modules/twitter/tweet');

const app = express();
const PORT = 80;

// Create logger for requests to API
app.use(requestLogger);

// These routes are protected, only chatbot can call these
app.all(ROUTES.TWITCH_MESSAGE_CONFIGURE, twitchMessageConfigure);
app.all(ROUTES.TWITCH_CLIP_CREATE, validateBot(twitchClipCreate));
app.all(ROUTES.TWITTER_TWEET,  validateBot(twitterTweet));
app.all(ROUTES.TWIP_CREATE, validateBot(twipCreate));

// Twitch API Start
app.all(ROUTES.TWITCH_LOGIN, twitchLogin);
app.all(ROUTES.TWITCH_LOGIN_SUCCESS, twitchLoginSuccess);

// Public HTML
app.all(ROUTES.PUBLIC_SETTINGS, (req, res) => res.render('settings'));

// Start
startServices(app, PORT);
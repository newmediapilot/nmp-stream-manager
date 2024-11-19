require('dotenv').config();
const express = require('express');
const { twitterTweet } = require('./modules/twitter/tweet');
const { twitchLogin, twitchLoginSuccess } = require('./modules/twitch/login');
const { twitchClipCreate } = require('./modules/twitch/clip');
const { twitchCommandCreate, twitchCommandSet, twitchCommandUnset } = require('./modules/twitch/commands');
const { twitchMessageCreate } = require('./modules/twitch/message'); // New import
const { startServices } = require('./modules/start');
const ROUTES = require('./routes');

const app = express();
const PORT = 80;

// Twitter API Start
app.all(ROUTES.TWITTER_TWEET, twitterTweet);

// Twitch API Start
app.all(ROUTES.TWITCH_LOGIN, twitchLogin);
app.all(ROUTES.TWITCH_LOGIN_SUCCESS, twitchLoginSuccess);
app.all(ROUTES.TWITCH_CLIP_CREATE, twitchClipCreate);

// Chat and Commands
app.all(ROUTES.TWITCH_MESSAGE_CREATE, twitchMessageCreate);
app.all(ROUTES.TWITCH_COMMAND_SET, twitchCommandSet);
app.all(ROUTES.TWITCH_COMMAND_UNSET, twitchCommandUnset);
app.all(ROUTES.TWITCH_COMMAND_CREATE, twitchCommandCreate);

// Public HTML
app.all(ROUTES.PUBLIC_SETTINGS, (req, res) => res.render('settings'));

startServices(app, PORT);

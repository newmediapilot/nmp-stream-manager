require('dotenv').config();
const express = require('express');
const { twitterTweet } = require('./modules/twitter/tweet');
const { twitchLogin } = require('./modules/twitch/login');
const { twitchLoginSuccess } = require('./modules/twitch/success');
const { twitchClipCreate } = require('./modules/twitch/clip');
const { createCommand } = require('./modules/twitch/commands');
const { twitchMessageCreate } = require('./modules/twitch/message'); // New import
const { startServices } = require('./modules/start');
const ROUTES = require('./routes');

const app = express();
const PORT = 80;

// Twitter API
app.all(ROUTES.TWITTER_TWEET, twitterTweet);

// Twitch API
app.all(ROUTES.TWITCH_LOGIN, twitchLogin);
app.all(ROUTES.TWITCH_LOGIN_SUCCESS, twitchLoginSuccess);
app.all(ROUTES.TWITCH_CLIP_CREATE, twitchClipCreate);
app.all(ROUTES.TWITCH_COMMAND_CREATE, createCommand);
app.all(ROUTES.TWITCH_MESSAGE_CREATE, twitchMessageCreate); // New route

// Public paths
app.all(ROUTES.PUBLIC_SETTINGS, (req, res) => res.render('settings'));

startServices(app, PORT);

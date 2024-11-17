/**
 * File: src\index.js
 * Description: This file contains logic for managing src\index operations.
 * Usage: Import relevant methods/functions as required.
 */
require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const { twitterTweet } = require('./modules/twitter/tweet'); // Import Twitter helper
const { twitchLogin } = require('./modules/twitch/login'); // Import the Twitch login handler
const { twitchLoginSuccess } = require('./modules/twitch/success'); // Import the Twitch login success handler
const { twitchClipCreate } = require('./modules/twitch/clip'); // Import the clip helper function
const { startServices } = require('./modules/start'); // Import the start services function

const app = express();
const PORT = 80; // Local port for your server

// Twitter API
app.get('/twitter/tweet', twitterTweet);

// Twitch API
app.get('/twitch/login', twitchLogin); // Redirect to Twitch login page
app.get('/twitch/login/success', twitchLoginSuccess); // Handle login success and return page
app.get('/twitch/clip/create', twitchClipCreate);

// Public paths
app.get('/public/index', (rep, res) => res.render('index', { message: 'Hello from index Nunjucks!' }));
app.get('/public/twitch/success', (rep, res) => res.render('twitch/success', { message: 'Hello from success Nunjucks!' }));

startServices(app, PORT);
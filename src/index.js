require("dotenv").config();
const ROUTES = require("./routes");
const express = require("express");
const { requestLogger } = require("./logger");
const { startServices } = require("./modules/start");
const { twitchLogin, twitchLoginSuccess } = require("./modules/twitch/login");

const app = express();

app.use(requestLogger);

app.all(ROUTES.TWITCH_LOGIN, twitchLogin);
app.all(ROUTES.TWITCH_LOGIN_SUCCESS, twitchLoginSuccess);

app.all(ROUTES.PUBLIC_INDEX, (req, res) => res.render("index"));
app.all(ROUTES.PUBLIC_DASHBOARD, (req, res) => res.render("dashboard"));

startServices(app);

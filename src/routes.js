/**
 * File: src\routes.js
 * Description: Logic and operations for src\routes.js.
 */

const ROUTES = {
  // Twitch API
  TWITCH_LOGIN: "/twitch/login",
  TWITCH_LOGIN_SUCCESS: "/twitch/login/success",
  // Public HTML
  PUBLIC_INDEX: "/",
  PUBLIC_DASHBOARD: "/public/dashboard",
  PUBLIC_SETTINGS: "/public/settings",
  PUBLIC_EMBED: "/public/embed",
  PUBLIC_HEART_EMBED: "/public/heart/embed",
  PUBLIC_HEART_PING: "/public/heart/ping",
  PUBLIC_SIGNAL_CREATE: "/public/signal/create",
  PUBLIC_CONFIG_UPDATE: "/public/config/create",
};

module.exports = ROUTES;

/**
 * File: src\routes.js
 * Description: Logic and operations for src\routes.js.
 */

const ROUTES = {
    // Twitch API
    TWITCH_LOGIN: "/twitch/login",
    TWITCH_REDIRECT_URL: process.env.TWITCH_REDIRECT_URL,
    TWITCH_LOGIN_SUCCESS: process.env.TWITCH_REDIRECT_URL.split('https://localhost')[1],
    // Public HTML
    PUBLIC_INDEX: "/",
    PUBLIC_DASHBOARD: "/public/dashboard",
    PUBLIC_SETTINGS: "/public/settings",
    PUBLIC_MODULES: "/public/modules",
    // Embed Panels
    PUBLIC_FEATURE_EMBED: "/public/feature/embed",
    PUBLIC_HEART_EMBED: "/public/heart/embed",
    // Api Calls
    PUBLIC_HEART_PING: "/public/heart/ping",
    PUBLIC_SIGNAL_CREATE: "/public/signal/create",
    PUBLIC_CONFIG_UPDATE: "/public/config/update",
    PUBLIC_STYLE_UPDATE: "/public/style/update",
};

module.exports = ROUTES;

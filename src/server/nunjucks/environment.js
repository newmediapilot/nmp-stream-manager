const nunjucks = require("nunjucks");
const express = require("express");
const {getParam} = require("../store/manager");
let env = null;
const context = () => {
    return {
        public_routes: getParam('public_routes'),
        device_ip: getParam('device_ip'),
        device_ip_suffix: getParam('device_ip_suffix'),
        dashboard_signals_config: getParam('dashboard_signals_config'),
        public_module_styles: getParam('public_module_styles'),
    }
};
const configureNunjucks = (app) => {
    env = nunjucks.configure('src/templates', {
        autoescape: true,
        express: app,
        noCache: true,
    });
    app.set("view engine", "html");
    app.use(express.static("src/client"));
};
const renderStringTemplate = (res, content) => {
    res.send(env.renderString(content, context()));
};
module.exports = {configureNunjucks, renderStringTemplate};
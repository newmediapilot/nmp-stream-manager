const nunjucks = require("nunjucks");
const express = require("express");
const {getParam} = require("../store/manager");
let env = null;
const generateContext = () => {
    const c = {
        public_routes: getParam('public_routes'),
        device_ip: getParam('device_ip'),
        device_ip_suffix: getParam('device_ip_suffix'),
        dashboard_signals_config: getParam('dashboard_signals_config'),
        public_module_styles: getParam('public_module_styles'),
    };
    console.log('generateContext ::', c);
    return c;
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
    const ctx = generateContext();
    console.log('renderStringTemplate.ctx', ctx);
    res.send(env.renderString(content, ctx));
};
module.exports = {configureNunjucks, renderStringTemplate};
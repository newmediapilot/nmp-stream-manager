const nunjucks = require("nunjucks");
const express = require("express");
const {getParam} = require("../store/manager");
const environment = (app = null) =>{
    return nunjucks.configure('src/templates', {
        autoescape: true,
        express: app,
        noCache: true,
    });
};
const configureNunjucks = (app) => {
    const env = environment(app);
    env.addFilter("getParamFilter", getParam);
    app.set("view engine", "html");
    app.use(express.static("src/client"));
};
const renderStringTemplate = (res, content) => {
    const env = environment();
    console.log('getParam', getParam);
    env.addFilter("getParamFilter", getParam);
    res.send(env.renderString(content));
};
module.exports = {configureNunjucks, renderStringTemplate};
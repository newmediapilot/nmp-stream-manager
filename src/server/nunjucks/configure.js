const nunjucks = require("nunjucks");
const express = require("express");
const {getParam} = require("../store/manager");
let nunjucksEnv = {};
const configureNunjucks = (app) => {
    nunjucksEnv = nunjucks.configure('src/templates', {
        autoescape: true,
        express: app,
        noCache: true,
    });
    nunjucksEnv.addFilter("getParamFilter", getParam);
    app.set("view engine", "html");
    app.use(express.static("src/client"));
};
const renderStringTemplate = (res, content) => {
    res.send(nunjucksEnv.renderString(content));
};
module.exports = {configureNunjucks, renderStringTemplate};
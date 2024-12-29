const nunjucks = require("nunjucks");
const express = require("express");
const {getParam} = require("../store/manager");
const configureNunjucks = (app) => {
    const nunjucksEnv = nunjucks.configure('src/templates', {
        autoescape: true,
        express: app,
        noCache: true,
    });
    nunjucksEnv.addFilter("getParamFilter", getParam);
    app.set("view engine", "html");
    app.use(express.static("src/client"));
};
module.exports = {configureNunjucks};
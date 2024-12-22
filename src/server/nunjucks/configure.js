const nunjucks = require("nunjucks");
const express = require("express");
const {getParam, getAllParams} = require("../store/manager");
const configureNunjucks = (app) => {
    const nunjucksEnv = nunjucks.configure("src/templates", {
        autoescape: true,
        express: app,
        noCache: true,
    });
    nunjucksEnv.addFilter("getParam", getParam);
    nunjucksEnv.addFilter("getAllParams", getAllParams);
    nunjucksEnv.addFilter("inlineScriptContents", (scriptTagContents) =>{
        if(scriptTagContents.contains('../client/script/')) {

        }
        if(scriptTagContents.contains('../client/style/')) {

        }
        console.log('scriptTagContents', scriptTagContents);
        return scriptTagContents;
    });
    nunjucksEnv.addFilter("cacheBuster", () => `?a=${new Date().getTime()}`);
    app.set("view engine", "html");
    app.use(express.static("src/client"));
    appRef = app;
};
module.exports = {configureNunjucks};

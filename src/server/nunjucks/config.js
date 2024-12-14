const nunjucks = require("nunjucks");
const express = require("express");
const { getParam, getAllParams } = require("../store/manager");
const { generateAssetLinks } = require("../nunjucks/preload.filter");
const configureNunjucks = (app) => {
  const nunjucksEnv = nunjucks.configure("src/templates", {
    autoescape: true,
    express: app,
    noCache: true,
  });
  nunjucksEnv.addFilter("getParam", getParam);
  nunjucksEnv.addFilter("getAllParams", getAllParams);
  nunjucksEnv.addFilter("urlencode", encodeURIComponent);
  nunjucksEnv.addFilter("generateAssetLinks", generateAssetLinks);
  nunjucksEnv.addFilter("currentTime", () => new Date().getTime().toString());
  app.set("view engine", "html");
  app.use(express.static("src/client"));
  appRef = app;
};
module.exports = { configureNunjucks };

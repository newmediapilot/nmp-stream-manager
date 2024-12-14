/**
 * File: src\modules\nunjucks\config.js
 * Description: Logic and operations for src\modules\nunjucks\config.js.
 */

const nunjucks = require("nunjucks");
const express = require("express");
const { getParam, getAllParams } = require("../store/manager");
const { generateAssetLinks } = require("../nunjucks/preload.filter");

/**
 * Configures Nunjucks for the provided Express app.
 * @param {object} app - The Express app instance.
 */
const configureNunjucks = (app) => {
  const nunjucksEnv = nunjucks.configure("src/views", {
    autoescape: true,
    express: app,
    noCache: true, // refresh on reload!
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

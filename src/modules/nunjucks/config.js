// src/modules/nunjucks/config.js
const nunjucks = require('nunjucks');
const express = require('express');
const {getParam, getAllParams} = require('../store/manager');

/**
 * Configures Nunjucks for the provided Express app.
 * @param {object} app - The Express app instance.
 */
function configureNunjucks(app) {

    const nunjucksEnv = nunjucks.configure(
        'src/views',
        {
            autoescape: true,
            express: app,
        });

    // Add custom filters
    nunjucksEnv.addFilter('getParam', getParam);
    nunjucksEnv.addFilter('getAllParams', getAllParams);

    app.set('view engine', 'html');
    app.use(express.static('src/assets'));
}

module.exports = {configureNunjucks};
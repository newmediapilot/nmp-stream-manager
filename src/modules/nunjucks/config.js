// src/modules/nunjucks/config.js
const nunjucks = require('nunjucks');
const express = require('express');
const { getParam, getAllParams } = require('../store/manager'); // Import the new filter

/**
 * Configures Nunjucks for the provided Express app.
 * @param {object} app - The Express app instance.
 */
function configureNunjucks(app) {
    const nunjucksEnv = nunjucks.configure('src/views', { // Path to your views folder
        autoescape: true, // Escape HTML in variables to prevent XSS
        express: app, // Bind Nunjucks to the Express app
    });

    // Add custom filters
    nunjucksEnv.addFilter('getParam', getParam);
    nunjucksEnv.addFilter('getAllParams', getAllParams);

    app.set('view engine', 'html'); // Set the view engine to HTML
    app.use(express.static('src/assets')); // Serve static assets
}

module.exports = { configureNunjucks };

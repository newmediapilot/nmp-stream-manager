const path = require('path');
const layouts = require('handlebars-layouts');
const {handlebars} = require('hbs');
const handlebarsLayoutsHelpers = layouts.register(handlebars);

console.log('handlebarsLayoutsHelpers', handlebarsLayoutsHelpers);

// Handlebars configuration
const handlebarsConfig = {
    extname: 'hbs', // File extension for Handlebars templates
    defaultLayout: 'main', // Default layout (optional, if used)
    partialsDir: path.join(__dirname, 'src/public/partials/'), // Partials directory
    layoutsDir: path.join(__dirname, 'src/public/layouts/'), // Partials directory
    helpers: {
        ...handlebarsLayoutsHelpers
    }
};

console.log('handlebarsConfig', handlebarsConfig);

module.exports = handlebarsConfig;

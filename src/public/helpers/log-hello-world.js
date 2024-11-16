module.exports = function (Handlebars) {
    // Register a simple 'logHelloWorld' helper
    Handlebars.registerHelper('logHelloWorld', function() {
        console.log("Hello World");
    });
};

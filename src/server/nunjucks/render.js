const nunjucks = require("nunjucks");
const renderTemplateName = (key) => {
    return nunjucks.render('index.html');
};
module.exports = {renderTemplateName};

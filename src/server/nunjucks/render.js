const nunjucks = require("nunjucks");
const renderStringTemplate = (res, content) => {
    res.send(nunjucks.renderString(content));
};
module.exports = {renderStringTemplate};
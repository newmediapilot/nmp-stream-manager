const nunjucks = require("nunjucks");
const renderString = (res, content) => {
    res.send(nunjucks.renderString(content));
};
module.exports = {renderString};
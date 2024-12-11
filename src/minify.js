const {minify} = require('html-minifier-terser');
const ROUTES = require("./routes");
const requestCompressed = (req, res, next) => {
    const originalSend = res.send;
    res.send = (body) => {
        if (req.path === ROUTES.PUBLIC_DASHBOARD) {
            console.log('Request matches /desired-path', body);
            originalSend.call(res, 'shit my balls');
        }else{
            originalSend.call(res, body);
        }
    };
    next();
};
module.exports = {requestCompressed};

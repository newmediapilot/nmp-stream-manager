const {minify} = require('html-minifier-terser');
const {getParam} = require("./modules/store/manager");
const requestCompressed = (req, res, next) => {
    const originalSend = res.send;
    res.send = (body) => {
        if (body.startsWith("<!DOCTYPE html>")) {
            const emoji_collection = getParam('emoji_collection');
            emoji_collection.forEach((e, i) => {
                body = body.replace(RegExp(e, 'gm'), i);
            });
            body = body.replace(/[\u200B-\u200D\uFEFF]/g, '');
            const indexOf = body.indexOf('<aside class=items">');
            console.log(body.substr(indexOf - 150, 50));
            minify(body, {
                collapseWhitespace: true
            }).then((result) => {
                //console.log('result.minified', result);
            }).catch((e) => {
                //console.log('No minify available.', e);
            });
        }
        originalSend.call(res, body);
    };
    next();
};
module.exports = {requestCompressed};
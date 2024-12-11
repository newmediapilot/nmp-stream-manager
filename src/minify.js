const {minify} = require('html-minifier-terser');
const { getParam } = require("./modules/store/manager");
const requestCompressed = (req, res, next) => {
    const originalSend = res.send;
    res.send = (body) => {
        if (body.startsWith("<!DOCTYPE html>")) {
            const emoji_collection = getParam('emoji_collection');
            emoji_collection.forEach((e,i) =>{
                body = body.replace(RegExp(e, 'gm'), i);
            });
            // body = body.replace(/[\p{Emoji}\u200B-\u200D\uFE0F\u2B50]/gu, '');
            // minify(body, {
            //     collapseWhitespace: true,
            //     removeComments: true,
            //     removeRedundantAttributes: true,
            //     useShortDoctype: true,
            //     minifyJS: {
            //         compress: true,
            //         mangle: true,
            //     },
            //
            //     minifyCSS: true,
            //     output: {
            //         ascii_only: false
            //     }
            // }).then((result) => {
            //     console.log('result.minified', result);
            // }).catch((e) => {
            //     console.log('No minify available.', e);
            // });
        }
        originalSend.call(res, body);
    };
    next();
};
module.exports = {requestCompressed};
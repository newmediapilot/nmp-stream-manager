const requestMinifier = (req, res, next) => {
    const originalRender = res.render;
    res.render = (view, locals, callback) => {
        originalRender.call(res, view, locals, (err, html) => {
            if(err) {
                next(); return;
            }
            callback(null, minify(html, {
                collapseWhitespace: true,
                removeComments: true,
                minifyJS: true,
                minifyCSS: true,
            });
        });
    };
    next();
};
module.exports = { requestMinifier };

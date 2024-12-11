const minify = require('minify');
app.use((req, res, next) => {
    const originalRender = res.render;
    res.render = (view, locals, callback) => {
        originalRender.call(res, view, locals, (err, html) => {
            const minifiedHtml = minify(html, {
                collapseWhitespace: true,
                removeComments: true,
                minifyJS: true,
                minifyCSS: true,
            });
            callback(null, minifiedHtml);
        });
    };
    next();
});
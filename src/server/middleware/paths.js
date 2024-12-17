const paths = (req, res, next) => {
    const originalSend = res.send;
    res.send = (body) => {
        if (
            (
                req.path === '/' ||
                req.path.startsWith('/public/')
            ) &&
            typeof body === 'string'
        ) {
            const src = body.match(new RegExp('src="../client', "gm"));
            src && src.forEach(match => {
                body = body.replace(match, "src=\"");
            });
            const href = body.match(new RegExp('href="../client', "gm"));
            href && href.forEach(match => {
                body = body.replace(match, "href=\"");
            });
        }
        originalSend.call(res, body);
    };
    next();
};
module.exports = {paths};
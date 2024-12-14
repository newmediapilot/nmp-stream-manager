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
            const matched = body.match(new RegExp("../client", "gm"));
            matched && matched.forEach(match => {
                body = body.replace(match, "");
            });
        }
        originalSend.call(res, body);
    };
    next();
};
module.exports = {paths};
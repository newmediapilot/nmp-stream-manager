const paths = (req, res, next) => {
    const originalSend = res.send;
    res.send = (body) => {
        if (
            (
                req.path.includes("/demo/")
            ) &&
            typeof body === 'string'
        ) {
            body = body.replace(new RegExp("../client", "gm"), "");
        }
        originalSend.call(res, body);
    };
    next();
};
module.exports = {paths};
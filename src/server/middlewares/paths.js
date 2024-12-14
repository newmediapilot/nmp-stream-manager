const paths = (req, res, next) => {
    const originalSend = res.send;
    res.send = (body) => {
        if (body.startsWith("/public/")) {

        }
        originalSend.call(res, body);
    };
    next();
};
module.exports = {cache};
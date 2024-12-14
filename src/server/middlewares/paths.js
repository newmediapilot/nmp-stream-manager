const paths = (req, res, next) => {
    const originalSend = res.send;
    res.send = (body) => {
        if (req.path.startsWith("/public/") && typeof body === 'string') {
            body = body.replace(/\.\.\/client/g, (m)=>{

                console.log('m', m);

                return "";
            });
        }
        originalSend.call(res, body);
    };
    next();
};
module.exports = {paths};
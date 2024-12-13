const cache = (req, res, next) => {
    if (
        req.url.includes('cdn.jsdelivr.net') || // for jsDelivr CDN
        req.url.includes('cdn.socket.io')    // for Socket.IO CDN
    ) {
        res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    }
    next();
};
module.exports = {cache};
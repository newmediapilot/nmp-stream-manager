const api = (req, res, next) => {
    const baseURL = "";
    req.path = req.path.startsWith("/") ? `${baseURL}${req.path}` : req.path;
    next();
};
module.exports = {api};
const logger = (req, res, next) => {
    console.info(
        process.cwd(),
        "REQUEST =>",
        req.path,
        "PARAMS =>",
        JSON.stringify(req.query || {}, null, 4),
    );
    next();
};
module.exports = {logger};
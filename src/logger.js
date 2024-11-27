requestLogger = (req, res, next) => {
  console.info2(process.cwd(), "REQUEST =>", req.path);
  next();
};

module.exports = { requestLogger };

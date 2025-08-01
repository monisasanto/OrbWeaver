function requestLogger(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    console.log({ method: req.method, path: req.path, duration: Date.now() - start });
  });
  next();
}
module.exports = requestLogger;

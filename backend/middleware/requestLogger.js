const Log = require("../../logging-middleware/logger");

async function requestLogger(req, res, next) {
  await Log("backend", "info", "middleware", `${req.method} ${req.originalUrl}`);
  next();
}

module.exports = requestLogger;

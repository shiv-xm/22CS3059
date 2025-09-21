// server/logger.js
const customLogger = (req, res, next) => {
  const logEntry = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - Logged by custom middleware`;
  console.log(logEntry);
  // In a real app, you would write this to a file or a logging service.
  next();
};

module.exports = customLogger;
/**
 * Request logging middleware
 * Logs all HTTP requests with timing and metadata
 */

function requestLogger(options = {}) {
  const {
    logBody = false,
    logHeaders = false,
    excludePaths = ['/health', '/metrics']
  } = options;

  return function(req, res, next) {
    // Skip logging for excluded paths
    if (excludePaths.includes(req.path)) {
      return next();
    }

    const start = Date.now();
    const originalSend = res.send;

    // Capture response
    res.send = function(body) {
      res.send = originalSend;
      return res.send(body);
    };

    res.on('finish', () => {
      const duration = Date.now() - start;
      const logEntry = {
        timestamp: new Date().toISOString(),
        method: req.method,
        path: req.path,
        query: req.query,
        status: res.statusCode,
        duration: `${duration}ms`,
        userAgent: req.get('user-agent'),
        ip: req.ip || req.connection.remoteAddress,
        contentLength: res.get('content-length')
      };

      if (logBody && req.body) {
        logEntry.body = req.body;
      }

      if (logHeaders) {
        logEntry.headers = req.headers;
      }

      // Color code by status
      const statusColor = res.statusCode >= 500 ? '\x1b[31m' : 
                         res.statusCode >= 400 ? '\x1b[33m' : 
                         '\x1b[32m';
      const reset = '\x1b[0m';

      console.log(
        `${logEntry.timestamp} ${statusColor}${logEntry.status}${reset} ` +
        `${logEntry.method} ${logEntry.path} - ${logEntry.duration}`
      );

      // Log detailed info for errors
      if (res.statusCode >= 400) {
        console.error('Error details:', logEntry);
      }
    });

    next();
  };
}

module.exports = requestLogger;

const fs = require('fs');
const path = require('path');

class Logger {
  constructor(logDir = './logs') {
    this.logDir = logDir;
    this.ensureLogDir();
  }

  ensureLogDir() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  getTimestamp() {
    return new Date().toISOString();
  }

  log(level, message, meta = {}) {
    const logEntry = {
      timestamp: this.getTimestamp(),
      level,
      message,
      ...meta
    };

    const logLine = JSON.stringify(logEntry) + '\n';

    console.log(`[${level}] ${message}`, meta);

    const logFile = path.join(
      this.logDir,
      `${new Date().toISOString().split('T')[0]}.log`
    );

    fs.appendFileSync(logFile, logLine);
  }

  info(message, meta) {
    this.log('INFO', message, meta);
  }

  error(message, meta) {
    this.log('ERROR', message, meta);
  }

  warn(message, meta) {
    this.log('WARN', message, meta);
  }

  debug(message, meta) {
    this.log('DEBUG', message, meta);
  }
}

module.exports = new Logger();


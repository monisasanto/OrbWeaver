/**
 * Logging utility with multiple log levels
 */
const fs = require('fs');
const path = require('path');

class Logger {
  constructor(options = {}) {
    this.level = options.level || process.env.LOG_LEVEL || 'info';
    this.logDir = options.logDir || './logs';
    this.levels = { debug: 0, info: 1, warn: 2, error: 3 };
    this.ensureLogDir();
  }

  ensureLogDir() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  shouldLog(level) {
    return this.levels[level] >= this.levels[this.level];
  }

  format(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}`;
  }

  write(level, message, meta = {}) {
    if (!this.shouldLog(level)) return;

    const formatted = this.format(level, message, meta);
    console.log(formatted);

    // Write to file
    const logFile = path.join(this.logDir, `${new Date().toISOString().split('T')[0]}.log`);
    fs.appendFileSync(logFile, formatted + '\n');
  }

  debug(message, meta) {
    this.write('debug', message, meta);
  }

  info(message, meta) {
    this.write('info', message, meta);
  }

  warn(message, meta) {
    this.write('warn', message, meta);
  }

  error(message, meta) {
    this.write('error', message, meta);
  }
}

const logger = new Logger();

module.exports = logger;
module.exports.Logger = Logger;

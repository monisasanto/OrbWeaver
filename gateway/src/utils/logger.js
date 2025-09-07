function log(level, msg) {
  console.log(\`[\${level}] \${new Date().toISOString()} \${msg}\`);
}
module.exports = { info: m => log('INFO', m), error: m => log('ERROR', m) };

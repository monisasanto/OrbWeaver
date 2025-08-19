class IndexerError extends Error {
  constructor(msg, code) {
    super(msg);
    this.code = code;
  }
}
class ChainConnectionError extends IndexerError {
  constructor(chainId) {
    super(\`Failed to connect to chain \${chainId}\`, 'CHAIN_ERROR');
  }
}
module.exports = { IndexerError, ChainConnectionError };

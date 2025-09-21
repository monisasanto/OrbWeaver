/**
 * Default configuration values for the indexer
 * These can be overridden by environment variables
 */

module.exports = {
  // Server
  port: parseInt(process.env.PORT) || 4000,
  host: process.env.HOST || '0.0.0.0',
  
  // Retry logic
  maxRetries: parseInt(process.env.MAX_RETRIES) || 3,
  retryDelay: parseInt(process.env.RETRY_DELAY) || 1000,
  timeout: parseInt(process.env.TIMEOUT) || 30000,
  
  // Batch processing
  batchSize: parseInt(process.env.BATCH_SIZE) || 100,
  maxBatchSize: 1000,
  minBatchSize: 10,
  
  // Polling
  pollInterval: parseInt(process.env.POLL_INTERVAL) || 15000,
  maxBlocksPerQuery: 10000,
  
  // Cache
  cacheEnabled: process.env.CACHE_ENABLED !== 'false',
  cacheTTL: parseInt(process.env.CACHE_TTL) || 3600,
  cacheMaxSize: parseInt(process.env.CACHE_MAX_SIZE) || 10000,
  
  // Database
  dbPoolSize: parseInt(process.env.DB_POOL_SIZE) || 20,
  dbIdleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT) || 30000,
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
  logDirectory: process.env.LOG_DIR || './logs',
  
  // Features
  enableMetrics: process.env.ENABLE_METRICS !== 'false',
  enableHealthCheck: process.env.ENABLE_HEALTH_CHECK !== 'false',
  
  // Safety
  reorgSafetyMargin: parseInt(process.env.REORG_SAFETY) || 64,
  confirmationsRequired: {
    ethereum: 12,
    polygon: 128,
    bsc: 15
  }
};

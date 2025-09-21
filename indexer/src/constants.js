/**
 * Indexer Constants
 * Configuration constants for the OrbWeaver Indexer
 */

// Server configuration
const DEFAULT_PORT = 4000;
const HOST = '0.0.0.0';
const SHUTDOWN_TIMEOUT = 10000;

// Batch processing
const MAX_BATCH_SIZE = 1000;
const MIN_BATCH_SIZE = 10;
const DEFAULT_BATCH_SIZE = 100;
const BATCH_TIMEOUT = 30000;

// Caching
const CACHE_TTL = 3600;
const CACHE_MAX_ENTRIES = 10000;
const CACHE_CLEANUP_INTERVAL = 300000; // 5 minutes

// Block processing
const BLOCK_CONFIRMATIONS = {
  ETHEREUM: 12,
  POLYGON: 128,
  BSC: 15,
  ARBITRUM: 1,
  OPTIMISM: 1
};

const POLL_INTERVAL = 15000; // 15 seconds
const MAX_BLOCKS_PER_QUERY = 10000;
const REORG_SAFETY_MARGIN = 64;

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;
const RETRY_BACKOFF_FACTOR = 2;

// Database
const DB_POOL_SIZE = 20;
const DB_IDLE_TIMEOUT = 30000;
const DB_CONNECTION_TIMEOUT = 5000;

// Logging
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const LOG_ROTATION_SIZE = '100M';
const LOG_RETENTION_DAYS = 30;

// Chain-specific settings
const CHAIN_CONFIGS = {
  1: { name: 'Ethereum', avgBlockTime: 12000, maxLogsPerQuery: 10000 },
  137: { name: 'Polygon', avgBlockTime: 2000, maxLogsPerQuery: 10000 },
  56: { name: 'BSC', avgBlockTime: 3000, maxLogsPerQuery: 5000 }
};

module.exports = {
  DEFAULT_PORT,
  HOST,
  SHUTDOWN_TIMEOUT,
  MAX_BATCH_SIZE,
  MIN_BATCH_SIZE,
  DEFAULT_BATCH_SIZE,
  BATCH_TIMEOUT,
  CACHE_TTL,
  CACHE_MAX_ENTRIES,
  CACHE_CLEANUP_INTERVAL,
  BLOCK_CONFIRMATIONS,
  POLL_INTERVAL,
  MAX_BLOCKS_PER_QUERY,
  REORG_SAFETY_MARGIN,
  MAX_RETRIES,
  RETRY_DELAY_MS,
  RETRY_BACKOFF_FACTOR,
  DB_POOL_SIZE,
  DB_IDLE_TIMEOUT,
  DB_CONNECTION_TIMEOUT,
  LOG_LEVEL,
  LOG_ROTATION_SIZE,
  LOG_RETENTION_DAYS,
  CHAIN_CONFIGS
};

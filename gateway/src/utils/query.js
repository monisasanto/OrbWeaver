/**
 * Query builder and validation utilities
 */

function buildQuery(schemaId, chainIds, options = {}) {
  const query = {
    id: generateQueryId(),
    schemaId,
    chainIds: Array.isArray(chainIds) ? chainIds : [chainIds],
    timestamp: Date.now(),
    ...options
  };

  return query;
}

function generateQueryId() {
  return `query_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function validateQuery(query) {
  const errors = [];

  if (!query.schemaId || typeof query.schemaId !== 'string') {
    errors.push('Invalid schemaId');
  }

  if (!Array.isArray(query.chainIds) || query.chainIds.length === 0) {
    errors.push('chainIds must be a non-empty array');
  }

  if (query.chainIds && query.chainIds.some(id => !Number.isInteger(id) || id <= 0)) {
    errors.push('All chainIds must be positive integers');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

function estimateQueryCost(query, baseCostPerChain = 0.001) {
  if (!query.chainIds) return 0;
  
  const chainCount = query.chainIds.length;
  const complexity = query.complexity || 1;
  
  return baseCostPerChain * chainCount * complexity;
}

function buildCrossChainQuery(schemaId, chainIds, filters = {}) {
  return {
    type: 'cross-chain',
    schemaId,
    chainIds,
    filters,
    timestamp: Date.now(),
    id: generateQueryId()
  };
}

function parseQueryResult(result) {
  return {
    data: result.data || [],
    totalResults: result.total || 0,
    chains: result.chains || [],
    executionTime: result.executionTime || 0
  };
}

module.exports = {
  buildQuery,
  generateQueryId,
  validateQuery,
  estimateQueryCost,
  buildCrossChainQuery,
  parseQueryResult
};

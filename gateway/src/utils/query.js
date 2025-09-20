function buildQuery(schemaId, chainIds) {
  return {
    schemaId,
    chainIds,
    timestamp: Date.now()
  };
}

function validateQuery(query) {
  return query.schemaId && Array.isArray(query.chainIds);
}

module.exports = { buildQuery, validateQuery };

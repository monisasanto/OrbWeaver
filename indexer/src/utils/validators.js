/**
 * Input validation utilities
 */

function validateAddress(address) {
  if (!address || typeof address !== 'string') return false;
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

function validateChainId(chainId) {
  return Number.isInteger(chainId) && chainId > 0;
}

function validateBlockNumber(blockNumber) {
  return Number.isInteger(blockNumber) && blockNumber >= 0;
}

function validateHash(hash) {
  if (!hash || typeof hash !== 'string') return false;
  return /^0x[a-fA-F0-9]{64}$/.test(hash);
}

function validateSchema(schema) {
  if (!schema || typeof schema !== 'object') {
    return { valid: false, error: 'Schema must be an object' };
  }

  if (!schema.entityType || typeof schema.entityType !== 'string') {
    return { valid: false, error: 'Invalid entity type' };
  }

  if (!Array.isArray(schema.fields) || schema.fields.length === 0) {
    return { valid: false, error: 'Schema must have at least one field' };
  }

  for (const field of schema.fields) {
    if (!field.name || !field.fieldType) {
      return { valid: false, error: 'Each field must have name and fieldType' };
    }
  }

  return { valid: true };
}

function validatePagination(page, pageSize, maxPageSize = 100) {
  const errors = [];

  if (!Number.isInteger(page) || page < 1) {
    errors.push('Page must be a positive integer');
  }

  if (!Number.isInteger(pageSize) || pageSize < 1) {
    errors.push('Page size must be a positive integer');
  }

  if (pageSize > maxPageSize) {
    errors.push(`Page size cannot exceed ${maxPageSize}`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  
  // Remove potential SQL injection characters
  return input.replace(/[';--]/g, '');
}

module.exports = {
  validateAddress,
  validateChainId,
  validateBlockNumber,
  validateHash,
  validateSchema,
  validatePagination,
  sanitizeInput
};

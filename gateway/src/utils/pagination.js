/**
 * Pagination utilities for API responses
 */

function paginate(items, page = 1, pageSize = 20) {
  // Validate inputs
  const validPage = Math.max(1, parseInt(page, 10));
  const validSize = Math.max(1, Math.min(100, parseInt(pageSize, 10)));
  
  const offset = (validPage - 1) * validSize;
  const paginatedItems = items.slice(offset, offset + validSize);
  const total = items.length;
  const totalPages = Math.ceil(total / validSize);

  return {
    items: paginatedItems,
    pagination: {
      page: validPage,
      pageSize: validSize,
      total,
      totalPages,
      hasNext: validPage < totalPages,
      hasPrev: validPage > 1,
      nextPage: validPage < totalPages ? validPage + 1 : null,
      prevPage: validPage > 1 ? validPage - 1 : null
    }
  };
}

function buildPaginationMeta(count, page, pageSize) {
  const totalPages = Math.ceil(count / pageSize);
  
  return {
    page,
    pageSize,
    total: count,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1
  };
}

function calculateOffset(page, pageSize) {
  return (page - 1) * pageSize;
}

function validatePaginationParams(page, pageSize, maxPageSize = 100) {
  const errors = [];
  
  if (!Number.isInteger(page) || page < 1) {
    errors.push('Page must be >= 1');
  }
  
  if (!Number.isInteger(pageSize) || pageSize < 1) {
    errors.push('Page size must be >= 1');
  }
  
  if (pageSize > maxPageSize) {
    errors.push(`Page size cannot exceed ${maxPageSize}`);
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

module.exports = {
  paginate,
  buildPaginationMeta,
  calculateOffset,
  validatePaginationParams
};

/**
 * Standardized API response formatting
 */

function success(data, meta = {}) {
  return {
    success: true,
    data,
    timestamp: new Date().toISOString(),
    ...meta
  };
}

function error(message, code = 'INTERNAL_ERROR', details = null) {
  return {
    success: false,
    error: {
      message,
      code,
      details,
      timestamp: new Date().toISOString()
    }
  };
}

function paginated(items, page, pageSize, total) {
  return {
    success: true,
    data: items,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
      hasNext: page * pageSize < total,
      hasPrev: page > 1
    },
    timestamp: new Date().toISOString()
  };
}

function validationError(field, message) {
  return error(`Validation failed for ${field}: ${message}`, 'VALIDATION_ERROR', { field });
}

function notFound(resource, id = null) {
  return error(
    `${resource} not found${id ? `: ${id}` : ''}`,
    'NOT_FOUND',
    { resource, id }
  );
}

function unauthorized(message = 'Unauthorized access') {
  return error(message, 'UNAUTHORIZED');
}

module.exports = {
  success,
  error,
  paginated,
  validationError,
  notFound,
  unauthorized
};

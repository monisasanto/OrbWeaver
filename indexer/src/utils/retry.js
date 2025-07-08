/**
 * Retry utility for handling transient failures
 */

class RetryError extends Error {
  constructor(message, attempts) {
    super(message);
    this.name = 'RetryError';
    this.attempts = attempts;
  }
}

async function retry(fn, options = {}) {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoff = 2,
    onRetry = null
  } = options;

  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxAttempts) {
        throw new RetryError(
          `Failed after ${maxAttempts} attempts: ${error.message}`,
          maxAttempts
        );
      }

      if (onRetry) {
        onRetry(error, attempt);
      }

      const waitTime = delay * Math.pow(backoff, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  throw lastError;
}

module.exports = { retry, RetryError };


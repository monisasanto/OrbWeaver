/**
 * Async utilities for handling concurrent operations
 */

async function retry(fn, options = {}) {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoff = 2,
    onRetry = null
  } = typeof options === 'number' ? { maxAttempts: options } : options;

  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxAttempts) {
        throw new Error(`Failed after ${maxAttempts} attempts: ${error.message}`);
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

async function parallel(tasks, concurrency = 5) {
  const results = [];
  
  for (let i = 0; i < tasks.length; i += concurrency) {
    const batch = tasks.slice(i, i + concurrency);
    const batchResults = await Promise.all(batch.map(task => task()));
    results.push(...batchResults);
  }
  
  return results;
}

async function sequential(tasks) {
  const results = [];
  
  for (const task of tasks) {
    results.push(await task());
  }
  
  return results;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function timeout(promise, ms, errorMessage = 'Operation timed out') {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(errorMessage)), ms)
    )
  ]);
}

async function batch(items, batchSize, processor) {
  const results = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const chunk = items.slice(i, i + batchSize);
    const chunkResults = await processor(chunk);
    results.push(...chunkResults);
  }
  
  return results;
}

module.exports = {
  retry,
  parallel,
  sequential,
  sleep,
  timeout,
  batch
};

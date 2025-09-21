/**
 * Simple in-memory cache with TTL support
 */
class Cache {
  constructor(options = {}) {
    this.data = new Map();
    this.ttl = options.ttl || 3600000; // 1 hour default
    this.maxSize = options.maxSize || 1000;
    this.hits = 0;
    this.misses = 0;
  }

  set(key, value, customTtl = null) {
    // Evict if cache is full
    if (this.data.size >= this.maxSize) {
      const firstKey = this.data.keys().next().value;
      this.data.delete(firstKey);
    }

    this.data.set(key, {
      value,
      expiresAt: Date.now() + (customTtl || this.ttl),
      createdAt: Date.now()
    });
  }

  get(key) {
    const entry = this.data.get(key);
    
    if (!entry) {
      this.misses++;
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.data.delete(key);
      this.misses++;
      return null;
    }

    this.hits++;
    return entry.value;
  }

  has(key) {
    return this.get(key) !== null;
  }

  delete(key) {
    return this.data.delete(key);
  }

  clear() {
    this.data.clear();
    this.hits = 0;
    this.misses = 0;
  }

  size() {
    return this.data.size;
  }

  getStats() {
    const total = this.hits + this.misses;
    return {
      size: this.data.size,
      hits: this.hits,
      misses: this.misses,
      hitRate: total > 0 ? (this.hits / total * 100).toFixed(2) + '%' : '0%'
    };
  }

  cleanup() {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.data.entries()) {
      if (now > entry.expiresAt) {
        this.data.delete(key);
        cleaned++;
      }
    }

    return cleaned;
  }
}

module.exports = Cache;

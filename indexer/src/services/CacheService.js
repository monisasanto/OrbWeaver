class CacheService {
  constructor(opts = {}) {
    this.cache = new Map();
    this.maxSize = opts.maxSize || 1000;
    this.ttl = opts.ttl || 3600000;
  }
  
  set(key, value, ttl = null) {
    if (this.cache.size >= this.maxSize) this.evict();
    this.cache.set(key, { value, expiresAt: Date.now() + (ttl || this.ttl) });
  }
  
  get(key) {
    const entry = this.cache.get(key);
    if (!entry || Date.now() > entry.expiresAt) return null;
    return entry.value;
  }
  
  evict() {
    const first = this.cache.keys().next().value;
    this.cache.delete(first);
  }
}
module.exports = CacheService;

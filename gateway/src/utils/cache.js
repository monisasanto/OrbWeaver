class Cache {
  constructor() { this.data = new Map(); }
  set(k, v) { this.data.set(k, v); }
  get(k) { return this.data.get(k); }
}
module.exports = Cache;

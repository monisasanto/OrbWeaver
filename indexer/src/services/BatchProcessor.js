class BatchProcessor {
  constructor(batchSize = 100) {
    this.batchSize = batchSize;
    this.queue = [];
  }
  async addToBatch(items) {
    this.queue.push(...items);
    if (this.queue.length >= this.batchSize) await this.process();
  }
  async process() {
    const batch = this.queue.splice(0, this.batchSize);
    return await this.processBatch(batch);
  }
  async processBatch(batch) { return batch; }
}
module.exports = BatchProcessor;

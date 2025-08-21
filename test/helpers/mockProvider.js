class MockProvider {
  constructor() {
    this.blockNumber = 1000;
    this.logs = [];
  }
  async getBlockNumber() { return this.blockNumber; }
  async getLogs(filter) {
    return this.logs.filter(log => 
      log.blockNumber >= filter.fromBlock && log.blockNumber <= filter.toBlock
    );
  }
}
module.exports = MockProvider;

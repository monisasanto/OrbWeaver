class EventIndexer {
  constructor(provider, chainConfig) {
    this.provider = provider;
    this.chainConfig = chainConfig;
    this.indexedEvents = [];
    this.isRunning = false;
  }

  async startIndexing() {
    if (this.isRunning) {
      console.log(`Indexer already running for chain ${this.chainConfig.name}`);
      return;
    }

    this.isRunning = true;
    console.log(`Starting event indexing for chain ${this.chainConfig.name}`);

    // Start the indexing loop
    this.indexingLoop();
  }

  async indexingLoop() {
    while (this.isRunning) {
      try {
        const latestBlock = await this.provider.getBlockNumber();
        const startBlock = Math.max(
          this.chainConfig.startBlock,
          latestBlock - 1000
        );

        await this.indexBlockRange(startBlock, latestBlock);

        // Wait before next iteration
        await this.sleep(15000);
      } catch (error) {
        console.error(`Indexing error for chain ${this.chainConfig.name}:`, error);
        await this.sleep(30000);
      }
    }
  }

  async indexBlockRange(startBlock, endBlock) {
    console.log(
      `Indexing blocks ${startBlock} to ${endBlock} on ${this.chainConfig.name}`
    );

    try {
      const logs = await this.provider.getLogs({
        fromBlock: startBlock,
        toBlock: endBlock
      });

      for (const log of logs) {
        await this.processLog(log);
      }

      console.log(`Indexed ${logs.length} events from blocks ${startBlock}-${endBlock}`);
    } catch (error) {
      console.error(`Failed to index block range:`, error);
      throw error;
    }
  }

  async processLog(log) {
    const event = {
      chainId: this.chainConfig.chainId,
      blockNumber: log.blockNumber,
      transactionHash: log.transactionHash,
      address: log.address,
      topics: log.topics,
      data: log.data,
      timestamp: Date.now()
    };

    this.indexedEvents.push(event);

    // Keep only recent events in memory
    if (this.indexedEvents.length > 10000) {
      this.indexedEvents = this.indexedEvents.slice(-5000);
    }
  }

  async getRecentEvents(limit = 100) {
    return this.indexedEvents.slice(-limit);
  }

  stopIndexing() {
    this.isRunning = false;
    console.log(`Stopped indexing for chain ${this.chainConfig.name}`);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = EventIndexer;


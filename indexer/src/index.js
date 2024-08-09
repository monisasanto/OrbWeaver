const express = require('express');
const { ethers } = require('ethers');
const config = require('../config.json');
const BlockProcessor = require('./processors/BlockProcessor');
const EventIndexer = require('./indexers/EventIndexer');

class OrbWeaverIndexer {
  constructor() {
    this.app = express();
    this.providers = new Map();
    this.blockProcessors = new Map();
    this.eventIndexers = new Map();
  }

  async initialize() {
    console.log('Initializing OrbWeaver Indexer...');

    // Setup express middleware
    this.app.use(express.json());

    // Initialize providers for each chain
    for (const chain of config.indexer.chains) {
      const provider = new ethers.JsonRpcProvider(chain.rpcUrl);
      this.providers.set(chain.chainId, provider);

      const blockProcessor = new BlockProcessor(provider, chain);
      this.blockProcessors.set(chain.chainId, blockProcessor);

      const eventIndexer = new EventIndexer(provider, chain);
      this.eventIndexers.set(chain.chainId, eventIndexer);

      console.log(`Initialized provider for chain ${chain.name} (${chain.chainId})`);
    }

    // Setup API routes
    this.setupRoutes();
  }

  setupRoutes() {
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        version: config.indexer.version,
        chains: config.indexer.chains.map(c => ({
          chainId: c.chainId,
          name: c.name
        }))
      });
    });

    this.app.get('/chains/:chainId/block/:blockNumber', async (req, res) => {
      try {
        const chainId = parseInt(req.params.chainId);
        const blockNumber = parseInt(req.params.blockNumber);

        const processor = this.blockProcessors.get(chainId);
        if (!processor) {
          return res.status(404).json({ error: 'Chain not found' });
        }

        const blockData = await processor.getBlock(blockNumber);
        res.json(blockData);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.get('/events/:chainId', async (req, res) => {
      try {
        const chainId = parseInt(req.params.chainId);
        const indexer = this.eventIndexers.get(chainId);

        if (!indexer) {
          return res.status(404).json({ error: 'Chain not found' });
        }

        const events = await indexer.getRecentEvents();
        res.json(events);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  }

  async start() {
    await this.initialize();

    const port = config.indexer.gateway.port;
    this.app.listen(port, config.indexer.gateway.host, () => {
      console.log(`OrbWeaver Indexer running on port ${port}`);
    });

    // Start indexing for all chains
    for (const [chainId, eventIndexer] of this.eventIndexers) {
      eventIndexer.startIndexing();
    }
  }
}

// Start the indexer
const indexer = new OrbWeaverIndexer();
indexer.start().catch(console.error);

module.exports = OrbWeaverIndexer;


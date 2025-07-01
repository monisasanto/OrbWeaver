# Frequently Asked Questions

## General

### What is OrbWeaver?

OrbWeaver is a cross-chain semantic indexing protocol that allows developers to query blockchain data across multiple chains using a single unified interface.

### Which chains are supported?

Currently supported:
- Ethereum (EVM)
- Polygon (EVM)
- BSC (EVM)

Coming soon:
- Aptos (Move)
- Sui (Move)
- Cosmos chains (CosmWasm)

### Is OrbWeaver open source?

Yes, OrbWeaver is open source under the MIT license.

## Technical

### How do I register a new schema?

Use the GraphQL mutation `registerSchema` with your entity type and field definitions.

### What are indexer nodes?

Indexer nodes are off-chain services that process blockchain data and map it to semantic schemas. They earn rewards for serving queries.

### How is data verified?

OrbWeaver supports optional zk-proofs to verify that indexed data matches on-chain truth.

### What's the query cost?

Base cost is 0.001 ETH per chain, multiplied by the number of chains queried.

## Development

### How do I run OrbWeaver locally?

See the [Deployment Guide](DEPLOYMENT.md) for local setup instructions.

### Can I contribute?

Yes! Please see our [Contributing Guidelines](../CONTRIBUTING.md).

### Where do I report bugs?

Open an issue on GitHub with detailed reproduction steps.

## Economics

### How do indexers earn rewards?

Indexers earn rewards based on query complexity, uptime, and accuracy.

### What is the governance model?

OrbWeaver uses a timelock-based governance system where stakeholders can propose and vote on changes.

### Is there a token?

Token economics are under development and will be announced separately.


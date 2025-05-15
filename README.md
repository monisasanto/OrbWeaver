# OrbWeaver

Cross-Chain Semantic Index & Unified Query Protocol

## Overview

OrbWeaver is a cross-chain semantic indexing and query protocol designed to standardize blockchain data into one unified graph, enabling developers to query multi-chain activity through a single interface.

## Features

- 🔗 Semantic schema registry for standardizing entity types
- 🌐 Cross-chain indexer network with incentivized nodes
- 🔐 Verifiable indexing with optional zk-proofs
- 📊 Unified GraphQL endpoint for multi-chain queries
- 💰 Query fee and caching reward mechanism
- 🔌 Pluggable chain adapters (EVM / Move / CosmWasm / L2s)
- 🏛️ Decentralized governance with timelock controls
- 📈 Real-time event indexing and block processing

## Architecture

```
┌─────────────┐
│   dApp/UI   │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ GraphQL Gateway │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Query Router   │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│    Indexers     │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Blockchain(s)  │
└─────────────────┘
```

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Hardhat

### Installation

```bash
# Clone the repository
git clone https://github.com/monisasanto/OrbWeaver.git
cd OrbWeaver

# Run setup script
./scripts/setup.sh

# Configure environment
cp .env.example .env
# Edit .env with your configuration

# Deploy smart contracts
npx hardhat run scripts/deploy.js --network localhost

# Start indexer
cd indexer && npm start

# Start GraphQL gateway (in another terminal)
cd gateway && npm start
```

## Usage

### Query Multi-Chain Data

```graphql
query {
  crossChainQuery(
    schemaId: "0x...",
    chainIds: [1, 137, 56]
  ) {
    chains {
      chainId
      data
      blockNumber
    }
    totalResults
  }
}
```

### Register a Schema

```graphql
mutation {
  registerSchema(
    entityType: "Position",
    fields: [
      { name: "amount", fieldType: "uint256", required: true },
      { name: "token", fieldType: "address", required: true }
    ]
  ) {
    success
    schemaId
  }
}
```

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [API Reference](docs/API.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Security Policy](docs/SECURITY.md)
- [Contributing](CONTRIBUTING.md)

## Testing

```bash
# Run all tests
npx hardhat test

# Run specific test
npx hardhat test test/SchemaRegistry.test.js

# Run with coverage
npx hardhat coverage
```

## Supported Chains

- ✅ Ethereum (EVM)
- ✅ Polygon (EVM)
- ✅ Binance Smart Chain (EVM)
- 🔄 Aptos (Move) - In Progress
- 🔄 Sui (Move) - In Progress
- 🔄 Cosmos (CosmWasm) - In Progress

## Project Status

🚧 Under active development

Current version: 0.1.0

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md).

## License

MIT License - see [LICENSE](LICENSE) file for details

## Team

Built with ❤️ by the OrbWeaver team

## Links

- [Documentation](docs/)
- [GitHub Issues](https://github.com/monisasanto/OrbWeaver/issues)
- [Discord Community](#) (Coming soon)


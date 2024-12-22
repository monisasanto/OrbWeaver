# OrbWeaver Architecture

## Overview

OrbWeaver is designed as a multi-layer system that enables cross-chain data querying through semantic standardization.

## System Layers

### 1. Smart Contract Layer

The core on-chain components that manage schemas, adapters, and routing logic.

#### Components:

- **SchemaRegistry**: Manages semantic schema definitions across chains
- **AdapterRegistry**: Tracks chain-specific adapters
- **QueryRouter**: Routes queries to appropriate chains and adapters
- **RewardModule**: Handles indexer incentives and slashing
- **zkIndexVerifier**: Verifies zero-knowledge proofs for data correctness

### 2. Indexer Layer

Off-chain indexing nodes that process blockchain data and map it to schemas.

#### Components:

- **BlockProcessor**: Processes blocks from various chains
- **EventIndexer**: Indexes and categorizes blockchain events
- **DataMapper**: Maps raw chain data to semantic schemas

### 3. Gateway Layer

The GraphQL API layer that provides a unified query interface.

#### Components:

- **GraphQL Server**: Exposes query endpoints
- **Resolvers**: Resolves cross-chain queries
- **Query Planner**: Optimizes multi-chain queries

## Data Flow

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

## Query Lifecycle

1. Client submits GraphQL query
2. Gateway parses and validates query
3. Query Router identifies required chains
4. Indexers fetch and map data
5. Gateway aggregates results
6. Response returned to client
7. Rewards distributed to indexers

## Security Model

### On-Chain Security

- Multisig governance for schema updates
- Whitelisted adapters per chain
- Slashing mechanism for malicious indexers

### Off-Chain Security

- Rate limiting on gateway
- Query validation and sanitization
- Proof verification for critical queries

## Scalability

- Horizontal scaling of indexer nodes
- Edge caching for frequent queries
- Parallel chain querying
- Pagination for large result sets

## Extensibility

The system is designed to be extended with:

- New chain adapters
- Custom schema types
- Alternative proof systems
- Additional reward mechanisms


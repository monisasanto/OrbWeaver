# Usage Examples

## Query Examples

### Basic Schema Query

```graphql
query {
  schema(schemaId: "0xabc123...") {
    entityType
    version
    fields {
      name
      fieldType
      required
    }
  }
}
```

### Cross-Chain Position Query

```graphql
query {
  crossChainQuery(
    schemaId: "0xposition123...",
    chainIds: [1, 137, 56]
  ) {
    chains {
      chainId
      data
      blockNumber
    }
    totalResults
    estimatedCost
  }
}
```

### Register New Schema

```graphql
mutation {
  registerSchema(
    entityType: "LiquidityPool",
    fields: [
      { name: "token0", fieldType: "address", required: true },
      { name: "token1", fieldType: "address", required: true },
      { name: "reserves", fieldType: "uint256", required: true }
    ]
  ) {
    success
    schemaId
    message
  }
}
```

## Smart Contract Examples

### Deploy and Configure

```javascript
const schemaRegistry = await SchemaRegistry.deploy(governance);
const adapterRegistry = await AdapterRegistry.deploy(governance);
const queryRouter = await QueryRouter.deploy(
  schemaRegistry.address,
  adapterRegistry.address,
  governance
);
```

### Register an Adapter

```javascript
await adapterRegistry.registerAdapter(
  1, // Ethereum chain ID
  evmAdapter.address,
  "Ethereum"
);
```

## Indexer Examples

### Start Indexer

```javascript
const indexer = new OrbWeaverIndexer();
await indexer.start();
```

### Query Indexer API

```bash
curl http://localhost:4000/events/1?limit=10
```

## Gateway Examples

### Start Gateway

```bash
cd gateway
npm start
```

### Query via GraphQL

```bash
curl -X POST http://localhost:4001/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ chains { chainId name } }"}'
```


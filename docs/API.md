# OrbWeaver API Documentation

## GraphQL API

The OrbWeaver Gateway exposes a GraphQL API for cross-chain queries.

### Endpoint

```
POST /graphql
```

### Authentication

Currently, the API is open. Future versions will support API keys and OAuth.

## Queries

### Get Chain Information

```graphql
query GetChain {
  chain(chainId: 1) {
    chainId
    name
    adapter
    active
    latestBlock
  }
}
```

### Get All Chains

```graphql
query GetChains {
  chains {
    chainId
    name
    active
  }
}
```

### Get Schema

```graphql
query GetSchema {
  schema(schemaId: "0x...") {
    schemaId
    entityType
    version
    fields {
      name
      fieldType
      required
    }
    active
  }
}
```

### Get Events

```graphql
query GetEvents {
  events(chainId: 1, limit: 100) {
    blockNumber
    transactionHash
    address
    topics
    timestamp
  }
}
```

### Cross-Chain Query

```graphql
query CrossChainQuery {
  crossChainQuery(
    schemaId: "0x...",
    chainIds: [1, 137, 56]
  ) {
    schemaId
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

### Get Block

```graphql
query GetBlock {
  block(chainId: 1, blockNumber: 18000000) {
    chainId
    chainName
    blockNumber
    blockHash
    timestamp
    transactions
    gasUsed
    gasLimit
  }
}
```

## Mutations

### Register Schema

```graphql
mutation RegisterSchema {
  registerSchema(
    entityType: "Position",
    fields: [
      { name: "amount", fieldType: "uint256", required: true },
      { name: "token", fieldType: "address", required: true }
    ]
  ) {
    success
    schemaId
    message
  }
}
```

### Register Adapter

```graphql
mutation RegisterAdapter {
  registerAdapter(
    chainId: 1,
    adapterAddress: "0x...",
    chainName: "Ethereum"
  ) {
    success
    chainId
    message
  }
}
```

## Response Codes

- **200**: Successful query
- **400**: Invalid query syntax
- **404**: Resource not found
- **500**: Internal server error

## Rate Limits

- 100 requests per minute per IP
- 10 cross-chain queries per minute per IP

## Best Practices

1. Use query variables for dynamic values
2. Request only needed fields
3. Implement client-side caching
4. Use pagination for large result sets
5. Handle errors gracefully


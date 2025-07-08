# Performance Optimization Guide

## Indexer Performance

### Database Indexing

Ensure proper database indexes are created:

```sql
CREATE INDEX idx_events_chain_block ON events(chain_id, block_number);
CREATE INDEX idx_events_address ON events(address);
```

### Caching Strategy

- Cache frequent queries for 60 seconds
- Use LRU cache with 10000 item limit
- Implement edge caching for static data

### Parallel Processing

- Index multiple chains simultaneously
- Batch database insertions
- Use connection pooling

## Gateway Performance

### Query Optimization

- Implement query complexity limits
- Use DataLoader for batch fetching
- Enable persisted queries

### Rate Limiting

- 100 requests/minute per IP
- 10 cross-chain queries/minute
- Implement exponential backoff

## Smart Contract Optimization

### Gas Optimization

- Use custom errors instead of strings
- Pack struct variables efficiently
- Minimize storage writes
- Use events for data logging

### Batch Operations

- Batch schema registrations
- Combine multiple adapter updates
- Use multicall for read operations

## Monitoring

### Metrics to Track

- Query response time
- Indexer sync lag
- Database connection pool usage
- API error rates
- Gas consumption

### Recommended Tools

- Prometheus for metrics
- Grafana for visualization
- Sentry for error tracking
- DataDog for APM

## Scalability

### Horizontal Scaling

- Deploy multiple indexer instances
- Use load balancer for gateway
- Implement sharding for large datasets
- Use read replicas for databases

### Caching Layers

- Redis for session data
- CDN for static content
- In-memory cache for hot data


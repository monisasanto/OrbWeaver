-- OrbWeaver Database Schema

CREATE TABLE IF NOT EXISTS chains (
    chain_id INTEGER PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    rpc_url TEXT NOT NULL,
    adapter_address VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    last_indexed_block BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS schemas (
    schema_id VARCHAR(255) PRIMARY KEY,
    entity_type VARCHAR(255) NOT NULL,
    version INTEGER NOT NULL,
    creator VARCHAR(255) NOT NULL,
    fields JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    chain_id INTEGER REFERENCES chains(chain_id),
    block_number BIGINT NOT NULL,
    transaction_hash VARCHAR(255) NOT NULL,
    log_index INTEGER NOT NULL,
    address VARCHAR(255) NOT NULL,
    topics JSONB NOT NULL,
    data TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    indexed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(chain_id, transaction_hash, log_index)
);

CREATE TABLE IF NOT EXISTS blocks (
    chain_id INTEGER,
    block_number BIGINT,
    block_hash VARCHAR(255) NOT NULL,
    parent_hash VARCHAR(255),
    timestamp TIMESTAMP NOT NULL,
    transaction_count INTEGER DEFAULT 0,
    gas_used VARCHAR(255),
    gas_limit VARCHAR(255),
    indexed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (chain_id, block_number),
    FOREIGN KEY (chain_id) REFERENCES chains(chain_id)
);

CREATE TABLE IF NOT EXISTS indexer_nodes (
    node_id VARCHAR(255) PRIMARY KEY,
    node_address VARCHAR(255) NOT NULL,
    stake_amount VARCHAR(255) NOT NULL,
    uptime_percentage DECIMAL(5,2) DEFAULT 100.00,
    accuracy_score INTEGER DEFAULT 100,
    queries_served BIGINT DEFAULT 0,
    total_rewards VARCHAR(255) DEFAULT '0',
    is_active BOOLEAN DEFAULT TRUE,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_seen_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS queries (
    query_id VARCHAR(255) PRIMARY KEY,
    schema_id VARCHAR(255),
    chain_ids JSONB NOT NULL,
    requester VARCHAR(255),
    estimated_cost VARCHAR(255),
    actual_cost VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    result JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE INDEX idx_events_chain_block ON events(chain_id, block_number);
CREATE INDEX idx_events_address ON events(address);
CREATE INDEX idx_events_timestamp ON events(timestamp);
CREATE INDEX idx_blocks_chain_number ON blocks(chain_id, block_number DESC);
CREATE INDEX idx_queries_status ON queries(status);
CREATE INDEX idx_queries_created ON queries(created_at DESC);


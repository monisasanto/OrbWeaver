# Deployment Guide

## Prerequisites

- Node.js 18+
- Hardhat
- Docker and Docker Compose (optional)
- PostgreSQL 15+ (if not using Docker)

## Smart Contract Deployment

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Network

Edit `hardhat.config.js` with your network settings and add your private key to `.env`:

```
PRIVATE_KEY=your_private_key_here
ETHEREUM_RPC=your_rpc_url
```

### 3. Compile Contracts

```bash
npx hardhat compile
```

### 4. Deploy Contracts

```bash
npx hardhat run scripts/deploy.js --network ethereum
```

Save the deployed contract addresses for the next steps.

## Indexer Deployment

### 1. Configure Indexer

Copy `.env.example` to `.env` in the indexer directory and update:

```bash
cd indexer
cp ../.env.example .env
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Indexer

```bash
npm start
```

## Gateway Deployment

### 1. Configure Gateway

Set environment variables in gateway directory:

```bash
cd gateway
cp ../.env.example .env
```

Update `INDEXER_URL` to point to your indexer service.

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Gateway

```bash
npm start
```

## Docker Deployment

### Using Docker Compose

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database
- Indexer service on port 4000
- Gateway service on port 4001

### Verify Deployment

Check services are running:

```bash
docker-compose ps
```

View logs:

```bash
docker-compose logs -f
```

## Production Considerations

1. **Security**: Use environment variables for sensitive data
2. **Scaling**: Deploy multiple indexer instances behind a load balancer
3. **Monitoring**: Set up logging and metrics collection
4. **Backups**: Regular database backups
5. **Rate Limiting**: Configure API rate limits
6. **SSL/TLS**: Use HTTPS in production

## Troubleshooting

### Indexer Issues

- Check RPC connectivity
- Verify blockchain node sync status
- Review logs in `logs/` directory

### Gateway Issues

- Ensure indexer is accessible
- Check CORS settings
- Verify GraphQL schema compatibility

### Contract Issues

- Confirm governance address
- Verify sufficient gas
- Check network connectivity


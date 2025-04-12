#!/bin/bash

echo "Setting up OrbWeaver development environment..."

# Install contract dependencies
echo "Installing contract dependencies..."
npm install

# Install indexer dependencies
echo "Installing indexer dependencies..."
cd indexer && npm install && cd ..

# Install gateway dependencies
echo "Installing gateway dependencies..."
cd gateway && npm install && cd ..

# Create logs directory
mkdir -p logs

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file from example..."
    cp .env.example .env
    echo "Please update .env with your configuration"
fi

# Compile smart contracts
echo "Compiling smart contracts..."
npx hardhat compile

echo "Setup complete!"
echo "Next steps:"
echo "1. Update .env with your configuration"
echo "2. Start PostgreSQL database"
echo "3. Run 'npm run deploy' to deploy contracts"
echo "4. Run 'cd indexer && npm start' to start indexer"
echo "5. Run 'cd gateway && npm start' to start gateway"


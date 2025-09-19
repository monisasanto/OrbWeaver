#!/bin/bash
echo "Validating configuration..."
[ -f .env ] && echo "✓ .env found" || echo "✗ .env missing"
[ -f hardhat.config.js ] && echo "✓ Hardhat config found" || echo "✗ Missing"

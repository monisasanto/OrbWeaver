# Contributing to OrbWeaver

We love your input! We want to make contributing to OrbWeaver as easy and transparent as possible.

## Development Process

1. Fork the repo and create your branch from `main`
2. If you've added code, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue a pull request

## Pull Request Process

1. Update the README.md with details of changes if applicable
2. Update the CHANGELOG.md with notes on your changes
3. The PR will be merged once you have the sign-off of maintainers

## Coding Standards

### Smart Contracts

- Follow Solidity style guide
- Add NatSpec comments for all public functions
- Write comprehensive tests for all contracts
- Use SafeMath or Solidity 0.8+ overflow protection

### JavaScript/Node.js

- Use ES6+ features
- Follow Airbnb style guide
- Add JSDoc comments for functions
- Write unit tests for all modules

### Commit Messages

Use semantic commit messages:

- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation changes
- `test:` adding tests
- `refactor:` code refactoring
- `chore:` maintenance tasks

## Testing

Run tests before submitting:

```bash
# Smart contract tests
npx hardhat test

# Indexer tests
cd indexer && npm test

# Gateway tests
cd gateway && npm test
```

## License

By contributing, you agree that your contributions will be licensed under the MIT License.


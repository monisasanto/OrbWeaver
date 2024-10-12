const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { readFileSync } = require('fs');
const { join } = require('path');
const express = require('express');
const cors = require('cors');
const resolvers = require('./resolvers');

async function startServer() {
  const app = express();

  // Read GraphQL schema
  const typeDefs = readFileSync(
    join(__dirname, 'schema.graphql'),
    'utf-8'
  );

  // Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  // Apply middleware
  app.use(
    '/graphql',
    cors(),
    express.json(),
    expressMiddleware(server)
  );

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      service: 'OrbWeaver GraphQL Gateway',
      version: '0.1.0'
    });
  });

  const PORT = process.env.PORT || 4001;

  app.listen(PORT, () => {
    console.log(`🚀 OrbWeaver GraphQL Gateway running at http://localhost:${PORT}/graphql`);
  });
}

startServer().catch(console.error);


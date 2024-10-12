const axios = require('axios');

const INDEXER_URL = process.env.INDEXER_URL || 'http://localhost:4000';

const resolvers = {
  Query: {
    chain: async (_, { chainId }) => {
      try {
        const response = await axios.get(`${INDEXER_URL}/chains/${chainId}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching chain:', error);
        return null;
      }
    },

    chains: async () => {
      try {
        const response = await axios.get(`${INDEXER_URL}/chains`);
        return response.data;
      } catch (error) {
        console.error('Error fetching chains:', error);
        return [];
      }
    },

    schema: async (_, { schemaId }) => {
      try {
        const response = await axios.get(`${INDEXER_URL}/schemas/${schemaId}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching schema:', error);
        return null;
      }
    },

    schemas: async (_, { entityType }) => {
      try {
        const url = entityType
          ? `${INDEXER_URL}/schemas?entityType=${entityType}`
          : `${INDEXER_URL}/schemas`;
        const response = await axios.get(url);
        return response.data;
      } catch (error) {
        console.error('Error fetching schemas:', error);
        return [];
      }
    },

    events: async (_, { chainId, limit }) => {
      try {
        const url = limit
          ? `${INDEXER_URL}/events/${chainId}?limit=${limit}`
          : `${INDEXER_URL}/events/${chainId}`;
        const response = await axios.get(url);
        return response.data;
      } catch (error) {
        console.error('Error fetching events:', error);
        return [];
      }
    },

    block: async (_, { chainId, blockNumber }) => {
      try {
        const response = await axios.get(
          `${INDEXER_URL}/chains/${chainId}/block/${blockNumber}`
        );
        return response.data;
      } catch (error) {
        console.error('Error fetching block:', error);
        return null;
      }
    },

    crossChainQuery: async (_, { schemaId, chainIds }) => {
      try {
        const response = await axios.post(`${INDEXER_URL}/query/cross-chain`, {
          schemaId,
          chainIds
        });
        return response.data;
      } catch (error) {
        console.error('Error executing cross-chain query:', error);
        return {
          schemaId,
          chains: [],
          totalResults: 0,
          estimatedCost: "0"
        };
      }
    }
  },

  Mutation: {
    registerSchema: async (_, { entityType, fields }) => {
      try {
        const response = await axios.post(`${INDEXER_URL}/schemas`, {
          entityType,
          fields
        });
        return {
          success: true,
          schemaId: response.data.schemaId,
          message: "Schema registered successfully"
        };
      } catch (error) {
        console.error('Error registering schema:', error);
        return {
          success: false,
          schemaId: null,
          message: error.message
        };
      }
    },

    registerAdapter: async (_, { chainId, adapterAddress, chainName }) => {
      try {
        const response = await axios.post(`${INDEXER_URL}/adapters`, {
          chainId,
          adapterAddress,
          chainName
        });
        return {
          success: true,
          chainId,
          message: "Adapter registered successfully"
        };
      } catch (error) {
        console.error('Error registering adapter:', error);
        return {
          success: false,
          chainId: null,
          message: error.message
        };
      }
    }
  }
};

module.exports = resolvers;


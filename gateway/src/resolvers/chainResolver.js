/**
 * Chain resolver for GraphQL queries
 * Handles chain information and metadata
 */

const resolvers = {
  Query: {
    chain: async (_, { chainId }, { dataSources }) => {
      try {
        const chain = await dataSources.chainAPI.getChain(chainId);
        
        if (!chain) {
          throw new Error(`Chain ${chainId} not found`);
        }
        
        return chain;
      } catch (error) {
        console.error(`Error fetching chain ${chainId}:`, error);
        throw error;
      }
    },

    chains: async (_, __, { dataSources }) => {
      try {
        const chains = await dataSources.chainAPI.getAllChains();
        return chains || [];
      } catch (error) {
        console.error('Error fetching chains:', error);
        return [];
      }
    },

    chainStatus: async (_, { chainId }, { dataSources }) => {
      try {
        const status = await dataSources.chainAPI.getChainStatus(chainId);
        return {
          chainId,
          active: status.active,
          latestBlock: status.latestBlock,
          syncProgress: status.syncProgress,
          lastUpdate: status.lastUpdate
        };
      } catch (error) {
        console.error(`Error fetching status for chain ${chainId}:`, error);
        return null;
      }
    }
  },

  Chain: {
    latestBlock: async (chain, _, { dataSources }) => {
      try {
        return await dataSources.chainAPI.getLatestBlock(chain.chainId);
      } catch (error) {
        console.error(`Error fetching latest block for chain ${chain.chainId}:`, error);
        return null;
      }
    }
  }
};

module.exports = resolvers;

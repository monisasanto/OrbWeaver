const resolvers = {
  Query: {
    chain: async (_, { chainId }, { dataSources }) => {
      return await dataSources.chainAPI.getChain(chainId);
    },
    chains: async (_, __, { dataSources }) => {
      return await dataSources.chainAPI.getAllChains();
    }
  }
};
module.exports = resolvers;

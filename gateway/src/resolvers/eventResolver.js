const resolvers = {
  Query: {
    events: async (_, { chainId, limit }, ctx) => {
      return await ctx.dataSources.eventAPI.getEvents(chainId, limit);
    },
    crossChainQuery: async (_, { schemaId, chainIds }, ctx) => {
      const results = await Promise.all(
        chainIds.map(cid => ctx.dataSources.eventAPI.queryBySchema(cid, schemaId))
      );
      return {
        schemaId,
        chains: results,
        totalResults: results.reduce((sum, r) => sum + r.data.length, 0)
      };
    }
  }
};
module.exports = resolvers;

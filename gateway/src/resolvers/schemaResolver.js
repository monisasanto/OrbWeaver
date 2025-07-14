const resolvers = {
  Query: {
    schema: async (_, { schemaId }, ctx) => {
      return await ctx.dataSources.schemaAPI.getSchema(schemaId);
    }
  },
  Mutation: {
    registerSchema: async (_, { entityType, fields }, ctx) => {
      return await ctx.dataSources.schemaAPI.register(entityType, fields);
    }
  }
};
module.exports = resolvers;

import { MutationResolvers } from '../generated/graphql';

export const mutationResolvers: MutationResolvers = {
  createProperty: async (_, args, { dbClient }) => {
    const property = await dbClient.createProperty(args);
    return true;
  },
  updateProperty: async (_, args, { dbClient }) => {
    const property = await dbClient.updateProperty(args);
    return true;
  }
};

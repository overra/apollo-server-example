import { Resolvers } from '../generated/graphql';
import { queryResolvers } from './query.resolvers';
import { mutationResolvers } from './mutation.resolvers';


export const resolvers: Resolvers = {
  Query: queryResolvers,
  Mutation: mutationResolvers,
};

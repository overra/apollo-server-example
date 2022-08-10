import { QueryResolvers } from '../generated/graphql';
import { convertProperty } from '../utils';

export const queryResolvers: QueryResolvers = {

  properties: async (_, __, { dbClient }) => {
    const modernProperties = await dbClient.getAllModernProperties();
    const [legacyProperties, fields] = await dbClient.getAllLegacyProperties();
    const ret = legacyProperties.map((property: { id: number; }) => {
      const modernMatch = modernProperties.find((modern) => modern.legacy_id == property.id);
      return modernMatch ? convertProperty(property, modernMatch) : convertProperty(property, {});

      }
    );
    return ret
  },
};

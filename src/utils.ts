import { Property } from './generated/graphql';

export function convertProperty(legacyProperty: any, modernProperty: any): Property {
  return {
    id: modernProperty.id,
    legacyId: legacyProperty.id,
    name: legacyProperty.name,
    isLive: modernProperty.is_live,
    goLiveDate: modernProperty.go_live_date.toDateString(),
    address: legacyProperty.address,
    city: legacyProperty.city,
    state: legacyProperty.state,
    zip: legacyProperty.zip,
    numberOfUnits: modernProperty.numer_of_units,
    created: legacyProperty.created_at.toISOString(),
    updated: legacyProperty.updated_at ? legacyProperty.updated_at.toISOString() : null,
  };
}

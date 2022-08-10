export type PropertyModernRow = {
  id: string;
  legacyId: number;
  name: string;
  isLive: boolean;
  goLiveDate: Date;
  numberOfUnits: number;
};

export type PropertyLegacyRow = {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  createdAt: Date;
  UpdatedAt: Date;
}

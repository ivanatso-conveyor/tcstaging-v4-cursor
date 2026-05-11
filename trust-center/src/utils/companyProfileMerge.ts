import type { TrustCenterCopy } from '../constants/trustCenterCopy';

export type SavedCompanyProfile = {
  displayName: string;
  tagline: string;
  bodySummary: string;
};

export function buildCompanyProfileFromCopy(id: TrustCenterCopy['identity']): SavedCompanyProfile {
  return {
    displayName: id.trustCenterDisplayName,
    tagline: id.taglineLight,
    bodySummary: id.body,
  };
}

export function mergeCompanyProfile(
  id: TrustCenterCopy['identity'],
  saved: SavedCompanyProfile | null,
): SavedCompanyProfile {
  return saved ?? buildCompanyProfileFromCopy(id);
}

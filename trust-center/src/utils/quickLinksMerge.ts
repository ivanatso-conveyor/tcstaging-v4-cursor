import type { TrustCenterCopy } from '../constants/trustCenterCopy';

export type SavedQuickLinks = {
  home: { display: string; url: string };
  privacy: { display: string; url: string };
  status: { display: string; url: string };
  vuln: { display: string; url: string };
};

export function buildQuickLinksFromCopy(id: TrustCenterCopy['identity']): SavedQuickLinks {
  return {
    home: { display: id.quickLinkHome, url: id.quickLinkHomeUrl },
    privacy: { display: id.quickLinkPrivacy, url: id.quickLinkPrivacyUrl },
    status: { display: id.quickLinkStatus, url: id.quickLinkStatusUrl },
    vuln: { display: id.quickLinkVuln, url: id.quickLinkVulnUrl },
  };
}

export function mergeQuickLinks(
  id: TrustCenterCopy['identity'],
  saved: SavedQuickLinks | null,
): SavedQuickLinks {
  return saved ?? buildQuickLinksFromCopy(id);
}

export function rowsFromSaved(saved: SavedQuickLinks): { display: string; url: string }[] {
  return [saved.home, saved.privacy, saved.status, saved.vuln];
}

export function savedFromRows(rows: { display: string; url: string }[]): SavedQuickLinks {
  return {
    home: rows[0]!,
    privacy: rows[1]!,
    status: rows[2]!,
    vuln: rows[3]!,
  };
}

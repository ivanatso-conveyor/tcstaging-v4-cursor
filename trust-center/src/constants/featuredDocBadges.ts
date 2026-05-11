import isae3402TypeI from '../assets/badges/isae-3402-type-i.svg';
import isae3402TypeII from '../assets/badges/isae-3402-type-ii.svg';
import ismap from '../assets/badges/ismap.svg';
import nist from '../assets/badges/nist.svg';
import cmmcBlue from '../assets/badges/cmmc-blue.svg';
import ecovadis from '../assets/badges/ecovadis.svg';
import hds from '../assets/badges/hds.svg';
import itar from '../assets/badges/itar.svg';

/** Badge artwork from `src/assets/badges` — shown at 24×24 in Featured Documents (no wrapper border). */
export const featuredDocBadgeSrc = {
  'isae-i': isae3402TypeI,
  'isae-ii': isae3402TypeII,
  ismap,
  nist,
  cmmc: cmmcBlue,
  ecovadis,
  hds,
  itar,
} as const;

export type FeaturedDocBadgeId = keyof typeof featuredDocBadgeSrc;

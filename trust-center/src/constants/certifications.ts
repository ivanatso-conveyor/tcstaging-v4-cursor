import cmmc from '../assets/badges/cmmc-blue.svg';
import ecovadis from '../assets/badges/ecovadis.svg';
import hds from '../assets/badges/hds.svg';
import isae3402TypeI from '../assets/badges/isae-3402-type-i.svg';
import isae3402TypeII from '../assets/badges/isae-3402-type-ii.svg';
import ismap from '../assets/badges/ismap.svg';
import itar from '../assets/badges/itar.svg';
import nist from '../assets/badges/nist.svg';

export type Certification = { name: string; image: string };

/** Badge art — imported so Vite emits correct URLs (works in dev + build). Files live in `src/assets/badges`. */
export const certifications: Certification[] = [
  { name: 'CMMC', image: cmmc },
  { name: 'EcoVadis', image: ecovadis },
  { name: 'HDS', image: hds },
  { name: 'ISAE 3402\nType I', image: isae3402TypeI },
  { name: 'ISAE 3402\nType II', image: isae3402TypeII },
  { name: 'ISMAP', image: ismap },
  { name: 'ITAR', image: itar },
  { name: 'NIST', image: nist },
];

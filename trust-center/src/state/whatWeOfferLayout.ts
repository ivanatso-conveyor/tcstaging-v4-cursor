/**
 * Shared display state for the "What We Offer" section: product order and layout style.
 * Module-level store so the section and the right-panel manage modal stay in sync
 * without piping state through TrustCenterContent.
 */
import { useSyncExternalStore } from 'react';
import { products } from '../constants/data';

export type WhatWeOfferLayoutStyle = 'z' | 'column';

export type WhatWeOfferState = {
  /** Product names in display order. */
  order: string[];
  layout: WhatWeOfferLayoutStyle;
};

const listeners = new Set<() => void>();

let state: WhatWeOfferState = {
  order: products.map((p) => p.name),
  layout: 'z',
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const getSnapshot = () => state;

export function useWhatWeOfferLayout(): WhatWeOfferState {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function setWhatWeOfferLayout(next: WhatWeOfferState): void {
  state = next;
  listeners.forEach((l) => l());
}

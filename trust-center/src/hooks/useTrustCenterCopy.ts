import { useMemo } from 'react';
import { useDesigner } from '../context/DesignerContext';
import { getTrustCenterCopy } from '../constants/trustCenterCopy';

export function useTrustCenterCopy() {
  const { state } = useDesigner();
  return useMemo(() => getTrustCenterCopy(state.previewLocale), [state.previewLocale]);
}

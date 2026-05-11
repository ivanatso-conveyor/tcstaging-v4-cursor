import { Fragment, useMemo, useState, type CSSProperties } from 'react';
import { TRUST_CENTER_DEFAULT_ACCENT, TRUST_CENTER_DEFAULT_PRIMARY } from '../../constants/brandDefaults';
import { useDesigner } from '../../context/DesignerContext';
import { ProductFilterProvider } from '../../contexts/ProductFilterContext';
import { ReviewingProductFilterProvider } from '../../contexts/ReviewingProductFilterContext';
import {
  DEFAULT_SECTION_ORDER,
  LAYOUT_SECTION_IDS,
  type LayoutSectionId,
} from '../../constants/layoutSectionOrder';
import StickyNav from '../Navigation/StickyNav';
import type { SearchItem } from '../../data/searchData';
import HeaderBanner from './HeaderBanner';
import IdentitySection from './IdentitySection';
import CertificationsSection from './CertificationsSection';
import DocumentsFAQsSection from './DocumentsFAQsSection';
import PhilosophySection from './PhilosophySection';
import QuickSummarySection from './QuickSummarySection';
import SubprocessorsSection from './SubprocessorsSection';
import TrustedBySection from './TrustedBySection';
import FeaturedDocumentsSection from './FeaturedDocumentsSection';
import AnnouncementsSection from './AnnouncementsSection';
import WhatWeOfferSection from './WhatWeOfferSection';
import VideoSection from './VideoSection';
import EditSectionPlaceholderModal from './EditSectionPlaceholderModal';
import CompanyProfileModal from './CompanyProfileModal';
import QuickLinksSettingsModal from './QuickLinksSettingsModal';
import TrustCenterImageryModal from './TrustCenterImageryModal';
import type { EditableTrustSectionId } from '../../contexts/TrustCenterSectionEditContext';
import { TrustCenterSectionEditProvider } from '../../contexts/TrustCenterSectionEditContext';

interface TrustCenterContentProps {
  standalone?: boolean;
}

function buildRenderPlan(order: readonly string[]): LayoutSectionId[] {
  return order.filter((id): id is LayoutSectionId =>
    (LAYOUT_SECTION_IDS as readonly string[]).includes(id),
  );
}

export default function TrustCenterContent({ standalone = false }: TrustCenterContentProps) {
  const [editSection, setEditSection] = useState<EditableTrustSectionId | null>(null);
  const { state } = useDesigner();
  const v = state.sectionVisibility;
  /** Public `/trust-center` ignores designer hide toggles so the page always shows full content. */
  const show = (id: string) => standalone || (v[id] ?? true);
  const sectionOrder = standalone ? [...DEFAULT_SECTION_ORDER] : state.sectionOrder;

  const onSectionClick = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const onDocumentClick = (_item: SearchItem) => {
    /* Prototype: document viewer not wired */
  };

  const onAskAI = (_query: string) => {
    /* Prototype: chat not wired */
  };

  const plan = buildRenderPlan(sectionOrder).filter((id) => show(id));

  const headerColor = standalone ? TRUST_CENTER_DEFAULT_PRIMARY : state.primaryColor;
  const accentColor = standalone ? TRUST_CENTER_DEFAULT_ACCENT : state.accentColor;
  const brandVars = {
    '--trust-center-header-color': headerColor,
    '--trust-center-accent-color': accentColor,
    '--color-trust-icon': accentColor,
  } as CSSProperties;

  const sectionEditValue = useMemo(
    () => ({
      enabled: !standalone,
      onSectionEdit: (id: EditableTrustSectionId) => setEditSection(id),
    }),
    [standalone],
  );

  const renderSection = (id: LayoutSectionId) => {
    switch (id) {
      case 'badges':
        return <CertificationsSection />;
      case 'find-answer':
        return <DocumentsFAQsSection />;
      case 'philosophy':
        return <PhilosophySection />;
      case 'quick-summary':
        return <QuickSummarySection />;
      case 'subprocessors':
        return <SubprocessorsSection />;
      case 'trusted-by':
        return <TrustedBySection />;
      case 'featured-documents':
        return <FeaturedDocumentsSection />;
      case 'announcements':
        return <AnnouncementsSection />;
      case 'what-we-offer':
        return <WhatWeOfferSection />;
      case 'video-resources':
        return <VideoSection />;
      default:
        return null;
    }
  };

  return (
    <ProductFilterProvider>
      <ReviewingProductFilterProvider>
        <div
          className={`min-w-0 ${standalone ? 'min-h-screen bg-primary-200' : 'min-h-0 w-full flex-1 overflow-y-auto bg-white'}`}
          style={brandVars}
        >
          <TrustCenterSectionEditProvider value={sectionEditValue}>
            <StickyNav
              onSectionClick={onSectionClick}
              onDocumentClick={onDocumentClick}
              onAskAI={onAskAI}
            />
            {/* Public `/trust-center`: light gray page, white card; banner is edge-to-edge inside the card. Designer: unchanged full-bleed white column. */}
            <div className={standalone ? 'px-4 pb-10 pt-0 sm:px-6 md:px-8' : ''}>
              <div
                className={
                  standalone
                    ? 'mx-auto max-w-[1360px] overflow-hidden rounded-t-none rounded-b-xl bg-white shadow-sm ring-1 ring-primary-400/50'
                    : 'mx-auto max-w-[1360px]'
                }
              >
                <HeaderBanner />

                <div
                  id="section-just-for-you"
                  className={`scroll-mt-20 h-px w-full shrink-0 ${standalone ? '' : 'max-w-[1360px] mx-auto'}`}
                  aria-hidden
                />

                <IdentitySection />

                <Divider />

                {plan.map((id, idx) => (
                  <Fragment key={id}>
                    {renderSection(id)}
                    {idx < plan.length - 1 ? <Divider /> : null}
                  </Fragment>
                ))}
              </div>
            </div>
            {editSection === 'quick-links' ? (
              <QuickLinksSettingsModal onClose={() => setEditSection(null)} />
            ) : editSection === 'profile' ? (
              <CompanyProfileModal onClose={() => setEditSection(null)} />
            ) : editSection === 'banner' || editSection === 'nav-brand' ? (
              <TrustCenterImageryModal onClose={() => setEditSection(null)} />
            ) : (
              <EditSectionPlaceholderModal section={editSection} onClose={() => setEditSection(null)} />
            )}
          </TrustCenterSectionEditProvider>
        </div>
      </ReviewingProductFilterProvider>
    </ProductFilterProvider>
  );
}

function Divider() {
  return <div className="mx-10 my-10 border-t border-primary-400" />;
}

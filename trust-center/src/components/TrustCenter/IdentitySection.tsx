/**
 * IdentitySection
 * Company headline, body, stat-style tags, and quick links card (`section-company-identity`).
 * Profile and quick links use pencil-only published hover because they edit live without the draft CTA.
 * Figma: Trust Center Vision HQ > Trust Center preview > Company identity
 */
import type { ReactNode } from 'react';
import { getDesignerTrustCenterPresentation, useDesigner } from '../../context/DesignerContext';
import { useTrustCenterSectionEdit } from '../../contexts/TrustCenterSectionEditContext';
import { useTrustCenterCopy } from '../../hooks/useTrustCenterCopy';
import { mergeCompanyProfile } from '../../utils/companyProfileMerge';
import { mergeQuickLinks } from '../../utils/quickLinksMerge';
import MaterialIcon from '../MaterialIcon';
import TrustCenterEditableRegion from './TrustCenterEditableRegion';

const TRUST_EMAIL = 'trust@mediacore.com';

export default function IdentitySection() {
  const copy = useTrustCenterCopy();
  const { state } = useDesigner();
  const { enabled, previewMode, onSectionEdit } = useTrustCenterSectionEdit();
  const quickLinks = mergeQuickLinks(copy.identity, state.savedQuickLinks);
  const companyProfile = mergeCompanyProfile(copy.identity, state.savedCompanyProfile);
  const presentation = getDesignerTrustCenterPresentation(state);
  const quickLinksVisible = presentation.sectionVisibility['quick-links'] !== false;
  const bodyParts = companyProfile.bodySummary.split(TRUST_EMAIL);

  return (
    <div id="section-company-identity" className="mx-10 pt-10 pb-0 scroll-mt-20">
      <div className="flex gap-10">
        <TrustCenterEditableRegion
          sectionId="profile"
          enabled={enabled}
          previewMode={previewMode}
          publishedOverlay="pencil-only"
          onEditClick={onSectionEdit}
          className="min-w-0 flex-1"
        >
          <div className="min-w-0">
            <div className="mb-4 flex items-center gap-1 whitespace-nowrap">
              <span
                className="text-[26px] text-primary-800"
                style={{ fontFamily: "'Neue Montreal', sans-serif", fontWeight: 500 }}
              >
                {companyProfile.displayName} |{' '}
              </span>
              <span
                className="text-[26px] text-primary-800"
                style={{ fontFamily: "'Neue Montreal', sans-serif", fontWeight: 300 }}
              >
                {companyProfile.tagline}
              </span>
            </div>

            <p
              className="mb-8 text-sm leading-[1.35] text-primary-700"
              style={{ fontFamily: "'Neue Montreal', sans-serif", fontWeight: 400 }}
            >
              {bodyParts.length === 2 ? (
                <>
                  {bodyParts[0]}
                  <a href={`mailto:${TRUST_EMAIL}`} className="text-link-400 underline decoration-solid">
                    {TRUST_EMAIL}
                  </a>
                  {bodyParts[1]}
                </>
              ) : (
                companyProfile.bodySummary
              )}
            </p>

            <div className="mb-8 flex flex-wrap gap-4">
              <Tag icon={<MaterialIcon symbol="description" size={16} color="var(--color-icon-default)" />} label={copy.identity.tagDocuments} />
              <Tag icon={<MaterialIcon symbol="chat_bubble" size={16} color="var(--color-icon-default)" />} label={copy.identity.tagFaqs} />
              <Tag icon={<MaterialIcon symbol="shield" size={16} color="var(--color-icon-default)" />} label={copy.identity.tagCerts} />
              <Tag icon={<MaterialIcon symbol="schedule" size={16} color="var(--color-icon-default)" />} label={copy.identity.tagActive} />
            </div>
          </div>
        </TrustCenterEditableRegion>

        {quickLinksVisible && (
          <div className="w-[220px] shrink-0">
            <TrustCenterEditableRegion
              sectionId="quick-links"
              enabled={enabled}
              previewMode={previewMode}
              publishedOverlay="pencil-only"
              onEditClick={onSectionEdit}
              className="min-w-0"
            >
              <div className="overflow-hidden rounded border border-primary-400 bg-white p-5">
                <h3
                  className="mb-2 text-xs uppercase tracking-[0.24px] text-primary-700"
                  style={{ fontFamily: "'Neue Montreal', sans-serif", fontWeight: 500 }}
                >
                  {copy.identity.quickLinksTitle}
                </h3>
                <div className="mt-3 flex flex-col gap-3">
                  <QuickLink
                    href={quickLinks.home.url}
                    icon={<MaterialIcon symbol="link" size={18} color="var(--color-link-400)" />}
                    label={quickLinks.home.display}
                  />
                  <QuickLink
                    href={quickLinks.privacy.url}
                    icon={<MaterialIcon symbol="link" size={18} color="var(--color-link-400)" />}
                    label={quickLinks.privacy.display}
                  />
                  <QuickLink
                    href={quickLinks.status.url}
                    icon={<MaterialIcon symbol="link" size={18} color="var(--color-link-400)" />}
                    label={quickLinks.status.display}
                  />
                  <QuickLink
                    href={quickLinks.vuln.url}
                    icon={<MaterialIcon symbol="pest_control" size={18} color="var(--color-link-400)" />}
                    label={quickLinks.vuln.display}
                  />
                </div>
              </div>
            </TrustCenterEditableRegion>
          </div>
        )}
      </div>
    </div>
  );
}

function Tag({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div
      className="flex items-center gap-1 px-2 py-1 rounded overflow-hidden h-6"
      style={{ backgroundColor: 'rgba(150,150,176,0.2)' }}
    >
      <div className="w-4 h-4 shrink-0 flex items-center justify-center">{icon}</div>
      <span
        className="text-xs whitespace-nowrap text-primary-800"
        style={{ fontFamily: "'Neue Montreal', sans-serif", fontWeight: 400 }}
      >
        {label}
      </span>
    </div>
  );
}

function QuickLink({ href, icon, label }: { href: string; icon: ReactNode; label: string }) {
  const isHttp = /^https?:\/\//i.test(href);
  return (
    <a
      href={href}
      className="group flex items-center gap-1.5"
      rel={isHttp ? 'noreferrer noopener' : undefined}
      target={isHttp ? '_blank' : undefined}
    >
      <div className="w-5 h-5 shrink-0 flex items-center justify-center">{icon}</div>
      <span
        className="text-sm text-link-400 whitespace-nowrap group-hover:underline"
        style={{ fontFamily: "'Neue Montreal', sans-serif", fontWeight: 400 }}
      >
        {label}
      </span>
    </a>
  );
}

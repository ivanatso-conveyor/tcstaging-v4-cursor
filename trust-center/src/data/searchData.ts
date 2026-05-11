export type SearchItemType = 'section' | 'document' | 'faq';

export interface SearchItem {
  id: string;
  type: SearchItemType;
  title: string;
  description: string;
  sectionId?: string;
  productLine?: string;
}

export const searchItems: SearchItem[] = [
  {
    id: 's1',
    type: 'section',
    title: 'Company Identity',
    description: 'MediaCore company overview and links',
    sectionId: 'section-company-identity',
  },
  {
    id: 's2',
    type: 'section',
    title: 'Just for You',
    description: 'Personalized documents and approval status',
    sectionId: 'section-just-for-you',
  },
  {
    id: 's3',
    type: 'section',
    title: 'Badges & Certifications',
    description: 'SOC 2, ISO 27001, GDPR, CCPA compliance badges',
    sectionId: 'section-badges',
  },
  {
    id: 's4',
    type: 'section',
    title: 'Find an Answer',
    description: 'Search the knowledge base for security questions',
    sectionId: 'section-find-answer',
  },
  {
    id: 's5',
    type: 'section',
    title: 'Documents & Knowledge Base',
    description: 'Browse documents and security categories',
    sectionId: 'section-documents',
  },
  {
    id: 's6',
    type: 'section',
    title: 'Philosophy',
    description: "MediaCore's security philosophy and approach",
    sectionId: 'section-philosophy',
  },
  {
    id: 's7',
    type: 'section',
    title: 'Quick Summary',
    description: 'Key security and compliance highlights',
    sectionId: 'section-quick-summary',
  },
  {
    id: 's8',
    type: 'section',
    title: 'Subprocessors',
    description: 'List of third-party subprocessors',
    sectionId: 'section-subprocessors',
  },
  {
    id: 's9',
    type: 'section',
    title: 'Trusted By',
    description: 'Companies that trust MediaCore',
    sectionId: 'section-trusted-by',
  },
  {
    id: 's10',
    type: 'section',
    title: 'Featured Documents',
    description: 'Key compliance and security documents',
    sectionId: 'section-featured-documents',
  },
  {
    id: 's11',
    type: 'section',
    title: 'Announcements',
    description: 'Latest trust center announcements',
    sectionId: 'section-announcements',
  },
  {
    id: 's12',
    type: 'section',
    title: 'What We Offer',
    description: 'MediaCore Pro and OnPrem offerings',
    sectionId: 'section-what-we-offer',
  },
  {
    id: 's13',
    type: 'section',
    title: 'Video Resources',
    description: 'Security and compliance video content',
    sectionId: 'section-video-resources',
  },

  {
    id: 'd1',
    type: 'document',
    title: 'SOC 2 Type II Report',
    description: 'Annual SOC 2 Type II audit report covering security, availability, and confidentiality.',
  },
  {
    id: 'd2',
    type: 'document',
    title: 'ISO 27001 Certificate',
    description: 'ISO 27001 information security management certification.',
  },
  {
    id: 'd3',
    type: 'document',
    title: 'Liability Insurance',
    description: 'Proof of liability insurance coverage.',
  },
  {
    id: 'd4',
    type: 'document',
    title: 'Organization Diagram',
    description: 'Company organizational structure diagram.',
  },
  {
    id: 'd5',
    type: 'document',
    title: 'Network Diagram',
    description: 'Network architecture and topology diagram.',
  },
  {
    id: 'd6',
    type: 'document',
    title: 'CAIQ Assessment',
    description: 'Consensus Assessments Initiative Questionnaire responses.',
  },
  {
    id: 'd7',
    type: 'document',
    title: 'Information Security Policy',
    description: 'Comprehensive information security policy document.',
  },
  {
    id: 'd8',
    type: 'document',
    title: 'Business Continuity Policy',
    description: 'Business continuity and disaster recovery policy.',
  },
  {
    id: 'd9',
    type: 'document',
    title: 'Penetration Test Summary',
    description: 'Summary of latest penetration testing results.',
  },
  {
    id: 'd10',
    type: 'document',
    title: 'Download Only Certificate',
    description: 'Testing the download only.',
  },

  {
    id: 'f1',
    type: 'faq',
    title: 'Is MediaCore SOC 2 compliant?',
    description: 'Yes, MediaCore maintains SOC 2 Type II compliance.',
    sectionId: 'section-badges',
  },
  {
    id: 'f2',
    type: 'faq',
    title: 'How does MediaCore handle data encryption?',
    description: 'All data is encrypted at rest and in transit using AES-256 and TLS 1.2+.',
    sectionId: 'section-quick-summary',
  },
  {
    id: 'f3',
    type: 'faq',
    title: 'What subprocessors does MediaCore use?',
    description: 'View our full list of subprocessors including AWS, Datadog, and more.',
    sectionId: 'section-subprocessors',
  },
  {
    id: 'f4',
    type: 'faq',
    title: 'Does MediaCore support GDPR?',
    description: 'Yes, MediaCore is fully GDPR compliant with data processing agreements available.',
    sectionId: 'section-badges',
  },
  {
    id: 'f5',
    type: 'faq',
    title: 'How can I report a vulnerability?',
    description: 'Use the Report a Vulnerability link on our trust center or contact security@mediacore.com.',
    sectionId: 'section-company-identity',
  },
  {
    id: 'f6',
    type: 'faq',
    title: "What is MediaCore's uptime SLA?",
    description: 'MediaCore Pro offers 99.9% uptime SLA. Details available in our offerings.',
    sectionId: 'section-what-we-offer',
  },
];

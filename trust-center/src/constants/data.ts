import type { FeaturedDocBadgeId } from './featuredDocBadges';

export const companyInfo = {
  name: 'Mediacore',
  tagline: 'Digital media experts',
  description:
    'Everything you need to complete your security review is here. Browse documents, certifications, and compliance details with confidence. Our Trust Center is regularly updated to reflect the latest audit results, and subprocessor disclosures. Reach out at trust@mediacore.com.',
  email: 'trust@mediacore.com',
  stats: [
    { label: '28 Documents', icon: 'file-text' },
    { label: '57 FAQs', icon: 'message-square' },
    { label: '8 Certifications', icon: 'shield-check' },
  ],
  activeTime: 'Active: 8 minutes ago',
  quickLinks: [
    { label: 'Mediacore Homepage', url: '#', icon: 'globe' },
    { label: 'Privacy Policy', url: '#', icon: 'globe' },
    { label: 'Status Page', url: '#', icon: 'globe' },
    { label: 'Report a vulnerability', url: '#', icon: 'globe' },
  ],
};

export const productFilters = [
  'All Products',
  'Cloud Product',
  'On-Prem Product',
  'API Gateway',
  'Mobile SDK',
  'Data Analytics',
  'Risk Management',
  'Security Q',
  'Mediacore Product',
  '+ 12 More',
];

export const documentCategories = [
  {
    title: 'Documents',
    count: 9,
    items: [
      { name: 'Overview', type: 'document', category: 'General' },
      { name: 'Application and Data Security', type: 'document', category: 'Security' },
      { name: 'Application and Data Security', type: 'document', category: 'Security' },
      { name: 'Continuity and Disaster Recovery', type: 'document', category: 'Business Continuity' },
      { name: 'Privacy', type: 'document', category: 'Privacy' },
    ],
  },
  {
    title: 'Knowledge Base FAQs',
    count: 51,
    items: [
      { name: 'Access Management', type: 'faq', category: 'Security' },
      { name: 'Personnel Security', type: 'faq', category: 'HR' },
      { name: 'Network Security', type: 'faq', category: 'Infrastructure' },
      { name: 'Device Management', type: 'faq', category: 'IT' },
      { name: 'Vendor Management', type: 'faq', category: 'Compliance' },
    ],
  },
];

/** Documents & Knowledge Base FAQs — tile grid matches Figma node 1060:34281 (row-major, 3 cols). */
export const documentsFaqTiles = [
  { name: 'Overview', answers: 6, icon: 'account_tree' },
  { name: 'Access Management', answers: 7, icon: 'folder_open' },
  { name: 'Risk and Vulnerability Management', answers: 10, icon: 'warning' },
  { name: 'Application and Data Security', answers: 15, icon: 'dns' },
  { name: 'Personnel Security', answers: 9, icon: 'groups' },
  { name: 'Incident Management', answers: 2, icon: 'report_problem' },
  { name: 'Application and Data Security', answers: 15, icon: 'dns' },
  { name: 'Personnel Security', answers: 9, icon: 'groups' },
  { name: 'Incident Management', answers: 2, icon: 'report_problem' },
  { name: 'Continuity and Disaster Recovery', answers: 1, icon: 'healing' },
  { name: 'Device Management', answers: 2, icon: 'laptop_mac' },
  { name: 'Cloud Security', answers: 12, icon: 'cloud_upload' },
  { name: 'Privacy', answers: 15, icon: 'lock' },
  { name: 'Vendor Management', answers: 4, icon: 'handshake' },
  { name: 'Security Governance', answers: 11, icon: 'verified_user' },
] as const;

export const bigCards = [
  {
    title: 'Documents',
    count: 9,
    icon: 'file-text',
    color: '#0D7DE4',
    showComplianceBadges: true,
  },
  {
    title: 'Knowledge Base FAQs',
    count: 57,
    icon: 'help-circle',
    color: '#33C69F',
    showComplianceBadges: false,
  },
];

/** Keys map to Font Awesome solid icons aligned with Trust Center Vision HQ (Figma 1060:34362). */
export type QuickSummaryIconKey =
  | 'audit'
  | 'penetration'
  | 'subprocessors'
  | 'dpa'
  | 'deleteData'
  | 'iam'
  | 'mdm'
  | 'disasterRecovery'
  | 'cyberInsurance'
  | 'bugBounty'
  | 'api'
  | 'statusPage';

export type QuickSummaryIndicator = {
  text: string;
  icon: QuickSummaryIconKey;
  /** When set, the label is shown as an underlined link followed by an “open in new tab” icon. */
  href: string | null;
};

export const indicators: { left: QuickSummaryIndicator[]; right: QuickSummaryIndicator[] } = {
  left: [
    {
      text: 'One or more annual third-party audit(s)',
      icon: 'audit',
      href: '#',
    },
    {
      text: 'Annual third-party penetration testing',
      icon: 'penetration',
      href: null,
    },
    {
      text: 'Subprocessors list available',
      icon: 'subprocessors',
      href: null,
    },
    {
      text: 'Will enter into a DPA',
      icon: 'dpa',
      href: null,
    },
    {
      text: 'Deletes customer data on request',
      icon: 'deleteData',
      href: '#',
    },
    {
      text: 'Uses a centralized IAM solution (SSO) to manage employee access',
      icon: 'iam',
      href: null,
    },
  ],
  right: [
    {
      text: 'Has a formal mobile device management (MDM) program',
      icon: 'mdm',
      href: null,
    },
    {
      text: 'Has a disaster recovery plan',
      icon: 'disasterRecovery',
      href: null,
    },
    {
      text: 'Has cyber insurance',
      icon: 'cyberInsurance',
      href: null,
    },
    {
      text: 'Has a bug bounty or vulnerability disclosure program',
      icon: 'bugBounty',
      href: null,
    },
    {
      text: 'Has an API available',
      icon: 'api',
      href: null,
    },
    {
      text: 'Has a status page',
      icon: 'statusPage',
      href: '#',
    },
  ],
};

/** `domain` is used with Logo.dev (`img.logo.dev/{domain}`). */
export const subprocessors = [
  {
    name: '1Password',
    domain: '1password.com',
    location: 'United States, Ireland, Japan',
    usage: 'Integration credentials.',
  },
  {
    name: 'Aptible',
    domain: 'aptible.com',
    location: 'United States',
    usage: 'PaaS',
  },
  {
    name: 'AWS',
    domain: 'aws.amazon.com',
    location: 'United States, Ireland, Brazil, Canada',
    usage: 'Hosting',
  },
  {
    name: 'Datadog',
    domain: 'datadoghq.com',
    location: 'United States',
    usage: 'Monitoring',
  },
  {
    name: 'Fivetran',
    domain: 'fivetran.com',
    location: 'United States',
    usage: 'Data tool Bridge',
  },
  {
    name: 'Mixpanel',
    domain: 'mixpanel.com',
    location: 'United States',
    usage: 'Product Analytics',
  },
  {
    name: 'Salesforce',
    domain: 'salesforce.com',
    location: 'United States',
    usage: 'Customer Support',
  },
  {
    name: 'Stripe',
    domain: 'stripe.com',
    location: 'United States',
    usage: 'Payments',
  },
];

/** Brand-tinted circle behind Logo.dev marks — fills the avatar edge-to-edge (no white mat). */
export const trustedByLogos = [
  { id: 'tb-1', name: 'Stripe', domain: 'stripe.com', circleBg: '#635BFF' },
  { id: 'tb-2', name: 'Shopify', domain: 'shopify.com', circleBg: '#95BF47' },
  { id: 'tb-3', name: 'Notion', domain: 'notion.so', circleBg: '#000000' },
  { id: 'tb-4', name: 'Slack', domain: 'slack.com', circleBg: '#4A154B' },
  { id: 'tb-5', name: 'HubSpot', domain: 'hubspot.com', circleBg: '#FF7A59' },
  { id: 'tb-6', name: 'Atlassian', domain: 'atlassian.com', circleBg: '#0052CC' },
  { id: 'tb-7', name: 'Datadog', domain: 'datadoghq.com', circleBg: '#632CA6' },
  { id: 'tb-8', name: 'Twilio', domain: 'twilio.com', circleBg: '#F22F46' },
  { id: 'tb-9', name: 'Okta', domain: 'okta.com', circleBg: '#007DC1' },
  { id: 'tb-10', name: 'Zoom', domain: 'zoom.us', circleBg: '#2D8CFF' },
] as const;

export type FeaturedDocumentItem = {
  name: string;
  badge: string;
  locked: boolean;
  badgeAsset?: FeaturedDocBadgeId;
};

export const featuredDocuments: { left: FeaturedDocumentItem[]; right: FeaturedDocumentItem[] } = {
  left: [
    { name: 'Background Check Process', badge: 'PDF', locked: false },
    { name: 'ISO 27001 Report', badge: 'PDF', locked: true, badgeAsset: 'ismap' },
    { name: 'System Diagram', badge: 'PDF', locked: false },
    { name: 'Acceptable Use Policy', badge: 'PDF', locked: false, badgeAsset: 'ecovadis' },
    { name: 'SOC 2 Type 2 Report (Cloud Product)', badge: 'PDF', locked: true, badgeAsset: 'isae-ii' },
  ],
  right: [
    { name: 'SOC 2 Type II (On-Prem)', badge: 'PDF', locked: true, badgeAsset: 'isae-ii' },
    { name: 'Breach Response Policy', badge: 'PDF', locked: true },
    { name: 'SOC 2 Type II (Pro Line)', badge: 'PDF', locked: true, badgeAsset: 'isae-i' },
  ],
};

export type AnnouncementItem = {
  title: string;
  date: string;
  excerpt: string;
};

export const announcements: AnnouncementItem[] = [
  {
    date: 'Mar 10, 2026',
    title: 'Test',
    excerpt:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
  },
  {
    date: 'Mar 10, 2026',
    title: 'ISO 42001 Forthcoming',
    excerpt: 'Great news! Mediacore is getting ISO 42001 certified.',
  },
];

export const products = [
  {
    name: 'Mediacore Pro',
    description: 'End-to-end creation and publishing platform for journalism and new media.',
    dataAccess: 'PII (name, email)',
    certifications: 'SOC 2 Type II, CSA, ISO 27001, GDPR',
  },
  {
    name: 'Mediacore On-Prem',
    description: 'Our best-in-class media publishing solution, now hosted on your servers.',
    dataAccess: 'None',
    certifications: 'SOC 2 Type II, GDPR, ISO 27001',
  },
];

export const philosophyContent = {
  text: "Here's where their philosophy would go. I need this to be a long paragraph so I can see how the text looks. I don't really know what to put in here though. Datadog is pretty legit and has a lot of people thinking about security, I would trust them.",
  author: 'Emilio Escobar',
  title: 'Chief Information Security Officer, Datadog',
};
